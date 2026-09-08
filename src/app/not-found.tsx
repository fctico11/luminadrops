import Link from "next/link";
import SiteHeader from "./(site)/site-header";
import Footer from "./(site)/footer";
import Motes from "./motes";
import { cormorant } from "./ui";

export const metadata = {
  title: "Page Not Found — Lumina Drops",
  description: "This page couldn't be found.",
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-[#141115] text-[#e9e1cd]">
      <SiteHeader />

      <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
        <Motes />

        <div className="relative w-full max-w-xl">
          <p className="text-xl font-medium tracking-[0.3em] lg:text-3xl">404</p>

          <div className="mx-auto mt-10 flex max-w-xs items-center gap-5 lg:mt-14 lg:max-w-md" aria-hidden>
            <span className="h-px flex-1 bg-[#4c4740]" />
            <span className="text-[11px] text-[#cfc6b1] lg:text-sm">✦</span>
            <span className="h-px flex-1 bg-[#4c4740]" />
          </div>

          <div className="mt-14 border border-dashed border-[#4c4740] px-8 py-20 lg:mt-20 lg:py-28">
            <p className="text-[11px] tracking-[0.28em] text-[#b9b09d] lg:text-xs">PAGE NOT FOUND</p>

            <p
              className={`${cormorant.className} mx-auto mt-6 max-w-md text-[15px] italic leading-relaxed text-[#c4bba8] lg:text-lg`}
            >
              This page slipped into the dark before we could find it.
            </p>

            <Link
              href="/home"
              className="mt-10 inline-block border border-[#6f695c] px-9 py-3.5 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:px-12 lg:py-4 lg:text-sm"
            >
              RETURN HOME
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
