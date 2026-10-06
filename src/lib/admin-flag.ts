/** A plain, readable cookie marking this browser as one that has signed in as
 * admin. The real session cookie is httpOnly, so client code can't see it;
 * this flag is what lets the tracking pixels and analytics skip admin visits
 * without making every public page read the session on the server (which
 * would stop them being statically rendered). It carries no secret and
 * grants nothing: forging it only switches off tracking for that visitor. */
export const ADMIN_FLAG_COOKIE = "luminadrops_admin_flag";

export function hasAdminFlag(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith(`${ADMIN_FLAG_COOKIE}=`));
}
