/** Toggles live per-address Shippo shipping rates at checkout. While false,
 * shipping is a flat $0 (folded into the product price): the checkout
 * session is created with a single $0 shipping option and the client never
 * calls /api/checkout/update-shipping, so no Shippo lookups happen.
 *
 * The calculation itself — quoteShippingForProduct in shipping.ts,
 * getCheapestRate in shippo.ts — and the /api/checkout/update-shipping route
 * are untouched. Flip this back to true to charge live rates again. */
export const LIVE_SHIPPING_ENABLED = false;
