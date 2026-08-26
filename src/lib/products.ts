/** Slug of the one product row backing the drop01 page and its admin editor.
 * There's only ever one live drop right now, so this is a fixed identifier
 * rather than something looked up dynamically. */
export const DROP01_SLUG = "drop-01";

export function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
