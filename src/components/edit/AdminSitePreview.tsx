import type { ReactNode } from "react";
import EditRoot from "./EditRoot";
import SiteHeader from "@/app/(site)/site-header";

/** Wraps a (site) page component for the /admin/edit/* preview: same header +
 * chrome the public route gets from (site)/layout.tsx, but with a real
 * EditModeProvider so the page's Editable* components go live. */
export default function AdminSitePreview({ children }: { children: ReactNode }) {
  return (
    <EditRoot>
      <div className="flex flex-1 flex-col bg-[#141115] text-[#e9e1cd]">
        <SiteHeader />
        {children}
      </div>
    </EditRoot>
  );
}
