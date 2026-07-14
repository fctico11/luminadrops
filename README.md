# Lumina Drops

A single-product "drop" storefront: one landing page, one product at a time,
Stripe Checkout for payment/shipping, and a password-protected `/admin`
dashboard for editing the product and site look (fonts, colors, images)
without touching code.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Postgres** via Prisma — product, images, theme, admin user, orders
- **Stripe Checkout** — dynamic pricing, shipping rate, tax-ready
- **Vercel Blob** — product image uploads from the admin dashboard
- **Custom auth** — single admin account, signed httpOnly session cookie (no third-party auth provider)
- Hosted on **Vercel**

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the values (see "Provisioning services" below):
   ```bash
   cp .env.example .env
   ```

3. Push the schema to your database and seed the admin account + placeholder product:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin`
   to sign in (with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`) and edit
   the product.

## Provisioning services

- **Postgres** — easiest is a free [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech) database. Copy the connection string into `DATABASE_URL`.
- **Stripe** — create an account, grab the test secret key from the [dashboard](https://dashboard.stripe.com/apikeys) for `STRIPE_SECRET_KEY`. For `STRIPE_WEBHOOK_SECRET`, either run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` locally, or create a webhook endpoint pointed at `https://<your-domain>/api/webhooks/stripe` (event: `checkout.session.completed`) once deployed.
- **Vercel Blob** — in the Vercel dashboard, go to Storage → create a Blob store, then copy the read/write token into `BLOB_READ_WRITE_TOKEN`.
- **SESSION_SECRET** — any long random string, e.g. `openssl rand -base64 32`.

## Deploying to Vercel

1. Push this repo to GitHub (already connected to `fctico11/luminadrops`).
2. In the [Vercel dashboard](https://vercel.com/new), import the GitHub repo.
3. Add all variables from `.env.example` as Environment Variables in the Vercel project settings.
4. Deploy. Vercel runs `npm run build`, which runs `prisma generate` automatically.
5. After the database is provisioned, run `npx prisma db push && npm run db:seed` once (locally, pointed at the production `DATABASE_URL`, or via `vercel env pull` + the same commands) to create tables and the admin account.
6. Add the Stripe webhook endpoint pointing at your production URL (`/api/webhooks/stripe`) once the domain is live.

## How the client (Lumina Drops) uses it day to day

- Go to `/admin`, sign in.
- Edit the drop's name, description, price, shipping cost, inventory, and status (Draft/Live/Sold out) — only a **Live** product shows on the landing page.
- Upload/remove product images.
- Adjust the site's heading font, body font, and three colors (text, background, accent) — any Google Fonts family name works.
- Changes go live immediately, no redeploy needed.

## What's a skeleton vs. production-ready

This gets the full flow working end-to-end (browse → buy → pay → admin-editable),
but before a real launch you'll want to:
- Expand `shipping_address_collection` allowed countries in [checkout/route.ts](src/app/api/checkout/route.ts) beyond US/CA
- Decide on real tax handling (Stripe Tax can be enabled on the Checkout Session)
- Add order-list view in `/admin` (the `Order` model already tracks paid orders)
- Add a "forgot password" flow if the client will manage her own credentials long-term
- Point `NEXT_PUBLIC_SITE_URL` at the real production domain
