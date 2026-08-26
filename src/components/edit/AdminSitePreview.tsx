import type { ReactNode } from "react";
import EditRoot from "./EditRoot";
import SiteHeader from "@/app/(site)/site-header";
import Footer from "@/app/(site)/footer";

/** Wraps a (site) page component for the /admin/edit/* preview: same header +
 * footer chrome the public route gets from (site)/layout.tsx, but with a real
 * EditModeProvider so the page's Editable* components go live. */
export default function AdminSitePreview({ children }: { children: ReactNode }) {
  return (
    <EditRoot>
      <div className="flex flex-1 flex-col bg-[#141115] text-[#e9e1cd]">
        <SiteHeader />
        {children}
        <Footer />
      </div>
    </EditRoot>
  );
}
