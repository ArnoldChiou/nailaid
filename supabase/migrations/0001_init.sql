-- 甲援 NailAid (formerly 指安 NailSafe) — initial schema
-- Visitors never touch tables directly: they call create_booking / get_booking /
-- active_notices (security definer). Only admins (public.admins) can read or edit rows.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- admins
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------- settings (single row, private)
create table public.settings (
  id int primary key default 1 check (id = 1),
  base_price int not null default 1500,
  rush_fee int not null default 500,
  bank_info text not null default '',   -- shown to customers only after booking
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1);
alter table public.settings enable row level security;
create policy "admin all settings" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- notices
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  pause_booking boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.notices enable row level security;
create policy "admin all notices" on public.notices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.active_notices()
returns table (message text, pause_booking boolean)
language sql stable security definer set search_path = public as $$
  select message, pause_booking from public.notices
  where active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  order by created_at desc;
$$;

-- ---------------------------------------------------------------- bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_no text not null unique,
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'done', 'declined', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'reported', 'paid')),
  urgency text not null check (urgency in ('rush', 'priority', 'normal')),

  service_mode text not null check (service_mode in ('home', 'hospital')),
  body_parts text not null check (body_parts in ('hands', 'feet', 'both')),
  nail_types text[] not null default '{}',
  nail_count int check (nail_count between 1 and 20),
  photo_paths text[] not null default '{}',

  surgery_at timestamptz not null,
  preferred_slots timestamptz[] not null check (cardinality(preferred_slots) between 1 and 3),
  confirmed_at timestamptz,

  city text not null check (city in ('taipei', 'new_taipei', 'taoyuan')),
  address text,
  hospital_name text,
  ward_room text,

  contact_name text not null check (char_length(contact_name) between 1 and 50),
  phone text not null check (phone ~ '^[0-9+\- ]{8,20}$'),
  line_id text,
  is_proxy boolean not null default false,
  payment_method text not null check (payment_method in ('cash', 'transfer')),
  note text check (char_length(note) <= 1000),

  estimated_price int not null,
  rush_fee int not null default 0,
  travel_fee int,
  final_price int,
  admin_note text,
  artist_id uuid,  -- reserved for multi-artist mode

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index bookings_status_idx on public.bookings (status, created_at desc);

alter table public.bookings enable row level security;
create policy "admin read bookings" on public.bookings
  for select to authenticated using (public.is_admin());
create policy "admin update bookings" on public.bookings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();

-- Keep in sync with src/lib/pricing.ts computeUrgency().
create or replace function public.compute_urgency(p_surgery timestamptz, p_slot timestamptz)
returns text language sql stable as $$
  select case
    when p_surgery - p_slot <= interval '24 hours' or p_slot - now() <= interval '24 hours' then 'rush'
    when p_surgery - now() <= interval '72 hours' then 'priority'
    else 'normal'
  end;
$$;

-- ---------------------------------------------------------------- create_booking (public)
create or replace function public.create_booking(p jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  v_slots timestamptz[];
  v_surgery timestamptz := (p->>'surgery_at')::timestamptz;
  v_mode text := p->>'service_mode';
  v_urgency text;
  v_rush int;
  v_settings public.settings;
  v_no text;
begin
  if exists (select 1 from public.active_notices() where pause_booking) then
    raise exception '目前暫停接受線上預約，請透過 LINE 或電話聯絡' using errcode = 'P0001';
  end if;

  select array_agg(x::timestamptz order by x::timestamptz) into v_slots
  from jsonb_array_elements_text(p->'preferred_slots') x;

  if v_surgery is null or v_slots is null then
    raise exception '請填寫手術時間與希望服務時段' using errcode = 'P0001';
  end if;
  if v_slots[1] < now() - interval '1 hour' then
    raise exception '希望服務時段不能早於現在' using errcode = 'P0001';
  end if;
  if v_mode = 'home' and coalesce(trim(p->>'address'), '') = '' then
    raise exception '到府服務請填寫地址' using errcode = 'P0001';
  end if;
  if v_mode = 'hospital' and coalesce(trim(p->>'hospital_name'), '') = '' then
    raise exception '到院服務請填寫醫院名稱' using errcode = 'P0001';
  end if;

  select * into v_settings from public.settings where id = 1;
  v_urgency := public.compute_urgency(v_surgery, v_slots[1]);
  v_rush := case when v_urgency = 'rush' then v_settings.rush_fee else 0 end;

  -- NS + Taipei date + 4 random chars, e.g. NS260928-K7QD
  loop
    v_no := 'NS' || to_char(now() at time zone 'Asia/Taipei', 'YYMMDD') || '-' ||
            substr(translate(upper(encode(gen_random_bytes(6), 'base64')), '+/=0O1IL', ''), 1, 4);
    exit when char_length(v_no) = 13 and not exists (select 1 from public.bookings where booking_no = v_no);
  end loop;

  insert into public.bookings (
    booking_no, urgency, service_mode, body_parts, nail_types, nail_count, photo_paths,
    surgery_at, preferred_slots, city, address, hospital_name, ward_room,
    contact_name, phone, line_id, is_proxy, payment_method, note,
    estimated_price, rush_fee
  ) values (
    v_no, v_urgency, v_mode, p->>'body_parts',
    coalesce(array(select jsonb_array_elements_text(p->'nail_types')), '{}'),
    nullif(p->>'nail_count', '')::int,
    coalesce(array(select jsonb_array_elements_text(p->'photo_paths')), '{}'),
    v_surgery, v_slots, p->>'city',
    nullif(trim(p->>'address'), ''), nullif(trim(p->>'hospital_name'), ''), nullif(trim(p->>'ward_room'), ''),
    trim(p->>'contact_name'), trim(p->>'phone'), nullif(trim(p->>'line_id'), ''),
    coalesce((p->>'is_proxy')::boolean, false), p->>'payment_method', nullif(trim(p->>'note'), ''),
    v_settings.base_price + v_rush, v_rush
  );

  return jsonb_build_object(
    'booking_no', v_no,
    'urgency', v_urgency,
    'estimated_price', v_settings.base_price + v_rush,
    'rush_fee', v_rush,
    'city', p->>'city',
    'payment_method', p->>'payment_method',
    'bank_info', v_settings.bank_info
  );
end $$;

-- ---------------------------------------------------------------- get_booking (public lookup)
create or replace function public.get_booking(p_no text, p_phone_last4 text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'booking_no', b.booking_no,
    'status', b.status,
    'payment_status', b.payment_status,
    'urgency', b.urgency,
    'service_mode', b.service_mode,
    'preferred_slots', b.preferred_slots,
    'confirmed_at', b.confirmed_at,
    'estimated_price', b.estimated_price,
    'travel_fee', b.travel_fee,
    'final_price', b.final_price,
    'payment_method', b.payment_method,
    'bank_info', case when b.payment_method = 'transfer' then s.bank_info end
  )
  from public.bookings b, public.settings s
  where s.id = 1
    and b.booking_no = upper(trim(p_no))
    and right(regexp_replace(b.phone, '\D', '', 'g'), 4) = p_phone_last4;
$$;

-- ---------------------------------------------------------------- grants
revoke all on function public.create_booking(jsonb) from public;
revoke all on function public.get_booking(text, text) from public;
grant execute on function public.create_booking(jsonb) to anon, authenticated;
grant execute on function public.get_booking(text, text) to anon, authenticated;
grant execute on function public.active_notices() to anon, authenticated;

-- ---------------------------------------------------------------- storage: nail photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('booking-photos', 'booking-photos', false, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do nothing;

-- Anyone may upload (write-only) under uploads/; only admins may view.
create policy "public upload booking photos" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'booking-photos' and (storage.foldername(name))[1] = 'uploads');
create policy "admin read booking photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'booking-photos' and public.is_admin());
