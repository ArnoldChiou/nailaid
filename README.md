# 甲援 NailAid

手術前指甲卸除 — 到府／到院接案預約網站。架構說明見 [ARCHITECTURE.md](ARCHITECTURE.md)。

- 前端：Next.js（static export）＋ Tailwind，部署於 GitHub Pages
- 後端：Supabase（資料庫、管理者登入、照片儲存、Edge Function）
- 通知：新訂單 → LINE Messaging API 推播給管理者

## 本機開發

```bash
npm install
npm run dev        # http://localhost:3000
```

未設定 `.env.local` 時網站會以 **示範模式** 運作：可完整操作預約流程，但不會儲存或通知。

## 上線設定（一次性）

### 1. Supabase
1. 到 <https://supabase.com> 建立專案（Region 建議 Tokyo 或 Singapore）。
2. SQL Editor → 貼上 `supabase/migrations/0001_init.sql` 全部內容執行。
3. Authentication → Users → **Add user**，建立管理者帳號（Email＋密碼）。
4. SQL Editor 執行，把該帳號設為管理者：
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = '你的管理者email';
   ```
5. Authentication → Providers → Email：關閉 **Allow new users to sign up**（只允許你手動建立的帳號）。
6. Project Settings → API：記下 **Project URL** 與 **anon public key**。

### 2. LINE 官方帳號（新訂單通知）
1. 到 <https://manager.line.biz> 建立 LINE 官方帳號。
2. 設定 → Messaging API → 啟用，建立 Provider。
3. 到 <https://developers.line.biz> 開啟該 channel：
   - **Messaging API** 分頁 → 發行 *Channel access token (long-lived)*
   - **Basic settings** 分頁 → 最下方 *Your user ID*（`U` 開頭）
4. 用你自己的 LINE 加這個官方帳號為好友（否則收不到推播）。

### 3. 部署 LINE 通知 Edge Function
```bash
npx supabase login
npx supabase link --project-ref <你的 project ref>
npx supabase secrets set LINE_CHANNEL_ACCESS_TOKEN=... LINE_ADMIN_USER_ID=U... WEBHOOK_SECRET=<自訂一串亂碼>
npx supabase functions deploy notify-line --no-verify-jwt
```
新訂單由資料庫 trigger（`0002_notify_trigger.sql`）呼叫此 function。把同一串 WEBHOOK_SECRET 存進 Vault：
```sql
select vault.create_secret('<同上的亂碼>', 'notify_webhook_secret');
```
呼叫結果可在 `net._http_response` 查看。

> 目前線上專案（ref `guwkwpgndvplygeiqead`）以上步驟皆已完成。

### 4. GitHub Pages
1. 在 GitHub 建立 **public** repo `nailaid`，把本專案 push 到 `main`。
2. Repo → Settings → Pages → Source 選 **GitHub Actions**。
3. Repo → Settings → Secrets and variables → Actions → **Variables** 新增：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 每次 push 到 `main` 會自動部署到 `https://arnoldchiou.github.io/nailaid/`。

> anon key 設計上可以公開，資料安全由資料庫的 RLS 保護。LINE token 只存在 Supabase secrets，**不要**放進 repo。

### 5. 上線前待填
- `src/lib/site.ts`：`phone`、`lineUrl`（LINE 官方帳號加好友連結）
- 後台 → 公告與設定：填寫匯款資訊

## 後台

`/admin/` — 以管理者帳號登入：
- **訂單**：急件排最前面；可更新狀態、確認時間、車馬費、最終金額、付款狀態、查看指甲照片
- **公告與設定**：網站公告（可暫停線上預約）、匯款資訊
