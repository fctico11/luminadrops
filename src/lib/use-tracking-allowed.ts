"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { hasAdminFlag } from "@/lib/admin-flag";

const subscribe = () => () => {};

/** False on /admin pages and in any browser that has signed in as admin, so
 * the team's own visits stay out of the ad pixels and traffic numbers. The
 * server snapshot is `false` (nothing tracked until the browser confirms it
 * isn't an admin's), which also keeps hydration consistent. */
export function useTrackingAllowed(): boolean {
  const pathname = usePathname();
  const notAdmin = useSyncExternalStore(
    subscribe,
    () => !hasAdminFlag(),
    () => false
  );
  return notAdmin && !pathname.startsWith("/admin");
}
