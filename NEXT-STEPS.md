# Pending / Next Steps

Running list of things we've discussed but paused or haven't finished yet. Update this as items get picked back up or completed.

## Dynamic shipping rate calculation — BUILT, needs real data + testing

Implemented on the `features` branch (2026-09-04): checkout is now a two-step flow —
1. Customer enters their shipping address (`shipping-address-form.tsx`), which calls `/api/shipping-rates` to show a live cheapest-carrier quote from Shippo.
2. On confirm, `/api/checkout` independently recomputes the same rate server-side (never trusts a client-supplied price — only the address influences cost) and creates the Stripe session with that exact amount baked into `shipping_options`. The `ShippingAddressElement` in step 2 is pre-filled with the step-1 address via Stripe's `contacts` option.

`Product` model gained `weightOz`, `lengthIn`, `widthIn`, `heightIn`, `shipFromName/Street1/Street2/City/State/Zip/Country` — all editable through the private `/admin/product` form (not the public git-committed content editor, since the ship-from address should never be public). If Shippo is unreachable or returns no rates, `quoteShippingForProduct` (`src/lib/shipping.ts`) silently falls back to the product's flat `shippingCents` value instead of blocking the sale — that field is now labeled "Flat shipping fallback" in the admin form rather than the primary price.

**Still needed before this actually works end to end:**
1. Owner needs to sign up for Shippo (**API** plan, not Starter/Pro — see reasoning below) and generate a test API key, add it as `SHIPPO_API_KEY` in `.env` locally and later Vercel.
2. Owner needs to fill in the real weight/dimensions/ship-from address in `/admin/product` — currently all zero/blank from the migration default, so it'll fall back to the flat `shippingCents` rate until filled in.
3. Test a full checkout run locally once the above two are done.
4. One known limitation: if a customer edits their address again in step 2's `ShippingAddressElement` (after already getting a step-1 quote), the shipping charge stays locked at the step-1 amount — it doesn't silently recalculate. Low-risk edge case, not fixed yet.

**Why the API plan on Shippo, not Starter/Pro:** Starter/Pro are for merchants using Shippo's own dashboard + pre-built store connectors (Shopify, Etsy, etc.). API is the tier meant for custom code talking to Shippo directly, which is what `src/lib/shippo.ts` does. All three tiers cap free usage at 30 **purchased/printed** labels per month — rate *quotes* (what powers the live checkout price) don't count against that at all, only actually buying a label to ship an order does.

**Important operational note for the owner:** Shippo (like Pirate Ship) gives *commercial/discounted* rates, not retail post-office counter rates — usually cheaper, never higher. To actually capture that discount, the owner needs to buy/print the label **through Shippo itself** after an order comes in, not pay retail at the counter, or they'd eat a loss on shipping. Also: the shipping label only covers postage, not the box/packaging materials — those are a separate cost the owner supplies (the free-box perk only applies to USPS's flat-rate program, which this dynamic-rate approach doesn't use).

## Apple Pay — waiting on owner

Steps needed (see conversation from 2026-09-02/03 for full detail):
1. Owner enables Apple Pay in Stripe Dashboard → Settings → Payment methods.
2. Owner adds the production domain under Apple Pay settings and downloads the domain verification file Stripe generates.
3. Owner sends that file to Claude, who adds it to `public/.well-known/apple-developer-merchantid-domain-association` (Next's `public/` folder serves it at that literal path, no code changes needed elsewhere since `payment_method_types` isn't restricted in `route.ts`).
4. Owner clicks "Verify" in the Dashboard once the file is live.

No code work possible until step 3 (need the actual file content from the owner's Dashboard).

## NC sales tax — registration still needed before going live

- Test-mode Stripe Tax is fully set up: head office = NC, one test-mode NC registration added, `automatic_tax: { enabled: true }` added to `src/app/api/checkout/route.ts` (on the `dev` branch, not yet merged to `main`).
- Preset product tax category needs fixing in the Dashboard (currently defaulted to "Digital products > Software," should be "General - Tangible Goods" since this is a physical product).
- Before flipping Stripe to live mode: the owner needs to actually register for a **real NC Certificate of Registration** (free, ~10–15 min online via ncdor.gov, no LLC required) and replace the placeholder test-mode registration number with the real one in live-mode Tax settings.
- Reminder: only NC needs to be registered at this stage (physical nexus). Other states aren't required until/unless economic nexus thresholds are crossed there — Stripe's Tax monitoring dashboard will flag that if/when it happens.

## Stripe live mode — not yet flipped

Test-mode keys are wired up and working end-to-end (checkout, webhooks, tax). Switching to live keys was intentionally deferred until:
- The NC tax registration above is real (not a placeholder).
- The owner is ready to accept real payments.

## `dev` branch

Created 2026-09-02 for testing new features without touching `main` (which the admin's content-editing auto-commits always land on directly). Currently contains the `automatic_tax: { enabled: true }` change, not yet merged. Vercel auto-builds a Preview deployment per push — check the Deployments tab or the branch's PR page for the URL. Preview shares the same Neon database and Stripe test keys as Production.
