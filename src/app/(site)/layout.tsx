import SiteHeader from "./site-header";
import Footer from "./footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-[#141115] text-[#e9e1cd]">
      <SiteHeader />
      {children}
      <Footer />
    </div>
  );
}
