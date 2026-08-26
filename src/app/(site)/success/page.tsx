import { getStripe } from "@/lib/stripe";
import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";
import ClearCart from "./clear-cart";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Confirmed — Lumina Drops",
  description: "Your Lumina Drops order is confirmed.",
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const content = getContent("success");

  let email: string | null = null;
  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
    } catch {
      // ignore — still show a generic confirmation
    }
  }

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
      <Motes />
      <ClearCart />
      <div className="relative w-full max-w-xl">
        <EditableText
          file="success"
          field="eyebrow"
          value={content.eyebrow}
          as="p"
          className={`${cormorant.className} teaser-rise text-[11px] tracking-[0.4em] text-[#9c9384] lg:text-sm`}
          style={rise(0.1)}
        />

        <EditableText
          file="success"
          field="title"
          value={content.title}
          as="h1"
          className={`${cormorant.className} teaser-rise mt-6 text-2xl font-medium italic text-[#e9e1cd] lg:mt-8 lg:text-4xl`}
          style={rise(0.25)}
        />

        <div
          className="teaser-rise mx-auto mt-10 flex max-w-xs items-center gap-5 lg:mt-14 lg:max-w-md"
          style={rise(0.4)}
          aria-hidden
        >
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1] lg:text-sm">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <p
          className={`${cormorant.className} teaser-rise mx-auto mt-10 max-w-sm text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg`}
          style={rise(0.55)}
        >
          {email ? (
            <EditableText
              file="success"
              field="bodyWithEmail"
              value={content.bodyWithEmail}
              displayValue={content.bodyWithEmail.replace("{email}", email)}
              as="span"
            />
          ) : (
            <EditableText file="success" field="bodyNoEmail" value={content.bodyNoEmail} as="span" />
          )}{" "}
          <EditableText file="success" field="shippingNote" value={content.shippingNote} as="span" />
        </p>

        <EditableLink
          href="/drop01"
          className="teaser-rise mt-12 inline-block border border-[#6f695c] px-9 py-3.5 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-16 lg:px-12 lg:py-4 lg:text-sm"
          style={rise(0.75)}
        >
          <EditableText file="success" field="backLabel" value={content.backLabel} as="span" />
        </EditableLink>
      </div>
    </main>
  );
}
