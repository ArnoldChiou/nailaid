-- Call the notify-line Edge Function after every new booking.
-- The shared secret lives in Supabase Vault (name: notify_webhook_secret), not in this repo:
--   select vault.create_secret('<same value as WEBHOOK_SECRET>', 'notify_webhook_secret');

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_booking()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url := 'https://guwkwpgndvplygeiqead.supabase.co/functions/v1/notify-line',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'notify_webhook_secret')
    ),
    body := jsonb_build_object('type', 'INSERT', 'table', 'bookings', 'record', to_jsonb(new))
  );
  return new;
end $$;

revoke all on function public.notify_new_booking() from public, anon, authenticated;

create trigger bookings_notify after insert on public.bookings
  for each row execute function public.notify_new_booking();
