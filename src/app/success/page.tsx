import { getStripe } from "@/lib/stripe";
import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";

export const dynamic = "force-dynamic";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-[#f5f2ea]">
      <EditableText
        file="success"
        field="eyebrow"
        value={content.eyebrow}
        as="p"
        className="text-[11px] uppercase tracking-[0.4em] text-[#c9a227]"
      />
      <EditableText
        file="success"
        field="title"
        value={content.title}
        as="h1"
        className="mt-4 text-3xl font-semibold tracking-tight"
      />
      <p className="mt-3 max-w-sm text-sm text-white/60">
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
        href="/"
        className="mt-8 border border-white/20 px-5 py-2 text-xs uppercase tracking-wider text-white/70 transition hover:border-[#c9a227] hover:text-[#c9a227]"
      >
        <EditableText file="success" field="backLabel" value={content.backLabel} as="span" />
      </EditableLink>
    </div>
  );
}
