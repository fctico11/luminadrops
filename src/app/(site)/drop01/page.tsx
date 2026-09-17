import { getContent } from "@/lib/content";
import { isAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";
import MobileFlow from "./mobile-flow";
import TrackViewContent from "./track-view-content";
import HeroVideo from "../../hero-video";

// One-time manual upload to Vercel Blob — see project notes for how to
// replace this if a new cut of the product page video is ever needed.
const DROP01_HERO_VIDEO_URL = "https://4crfi1phembmhxzs.public.blob.vercel-storage.com/productpage-clearer.mp4";

export const metadata = {
  title: "The Midnight Margarita Club — Lumina Drops",
  description: "Drop No. 01. An Everlong Midnight, tucked into one box.",
};

export default async function Drop01Page() {
  const [isAdmin, product] = await Promise.all([
    isAdminSession(),
    prisma.product.findUnique({ where: { slug: DROP01_SLUG } }),
  ]);

  const content = getContent("drop01");
  const soldOut = !product || product.status !== "LIVE" || product.inventory <= 0;
  const maxQuantity = Math.min(2, product?.inventory ?? 0);

  return (
    <main className="grain relative flex flex-1 flex-col">
      <Motes />
      {product && (
        <TrackViewContent
          productId={product.id}
          productName={product.name}
          priceCents={product.priceCents}
          currency={product.currency}
        />
      )}

      {/* Hero */}
      <section className="relative w-full border-b border-[#2a2620]">
        <div className="teaser-rise aspect-video w-full bg-black lg:aspect-auto lg:h-screen" style={rise(0.1)}>
          <HeroVideo
            src={DROP01_HERO_VIDEO_URL}
            endedContent={
              <div>
                <EditableText
                  file="drop01"
                  field="dropLabel"
                  value={content.dropLabel}
                  as="p"
                  className="text-[11px] tracking-[0.28em] text-[#b9b09d] lg:text-xs"
                />
                {/* The wordmark image centers "THE / Midnight" and
                    "MARGARITA CLUB" as one fixed graphic, but "THE" sits far
                    enough left that centering the image's own bounding box
                    visibly throws "MARGARITA CLUB" — the line most people
                    actually read as the title — off-center. Shifted left by
                    the measured 90px/901px gap between the two so the
                    bottom line lands on the page's true center instead. */}
                <h1 className="relative mx-auto mt-3 aspect-[901/528] w-40 -translate-x-[10%] sm:w-72 lg:mt-5 lg:w-[30rem]">
                  <EditableImage
                    file="drop01"
                    field="titleImage"
                    src={content.titleImage}
                    alt={content.titleImageAlt}
                    exportWidth={1200}
                    exportHeight={700}
                    className="object-contain"
                  />
                </h1>
                <EditableText
                  file="drop01"
                  field="tagline"
                  value={content.tagline}
                  as="p"
                  className={`${cormorant.className} mx-auto mt-3 max-w-[15rem] text-sm italic text-[#d6cdb8] sm:max-w-sm sm:text-base lg:mt-6 lg:max-w-sm lg:text-xl`}
                />
              </div>
            }
          />
        </div>
      </section>

      <MobileFlow
        content={content}
        isAdmin={isAdmin}
        soldOut={soldOut}
        maxQuantity={maxQuantity}
        productId={product?.id ?? ""}
        productName={product?.name ?? ""}
        priceCents={product?.priceCents ?? 0}
        currency={product?.currency ?? "usd"}
      />
    </main>
  );
}
