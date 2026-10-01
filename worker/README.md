# Sirojovlar API deploy (Cloudflare — free forever)

Do these ONCE, in this order. Needs the API token + Account ID from the owner.

```bash
# 1. login-free auth for deploy (paste token when asked via env)
npm i -D wrangler

# 2. create resources
npx wrangler d1 create sirojovlar
# → paste database_id into worker/wrangler.toml

npx wrangler r2 bucket create sirojovlar-photos

# 3. create tables
npx wrangler d1 execute sirojovlar --file=worker/schema.sql

# 4. secret for first-owner bootstrap (invent a long random string)
npx wrangler secret put BOOTSTRAP_KEY --config worker/wrangler.toml

# 5. deploy
npx wrangler deploy --config worker/wrangler.toml
# → gives https://sirojovlar-api.<you>.workers.dev
```

Env for headless deploy (do NOT commit):
```bash
set CLOUDFLARE_API_TOKEN=xxxx
set CLOUDFLARE_ACCOUNT_ID=xxxx
```

App connects via `VITE_API_URL=https://sirojovlar-api.<you>.workers.dev`
(first owner account is created from inside the app Setup screen with BOOTSTRAP_KEY).
