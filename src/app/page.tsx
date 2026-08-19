import Image from "next/image";
import { getActiveProduct, formatPrice } from "@/lib/products";
import { getTheme, googleFontsHref } from "@/lib/theme";
import BuyButton from "./buy-button";
import Teaser from "./teaser";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [product, theme] = await Promise.all([getActiveProduct(), getTheme()]);

  const headingFont = { fontFamily: `"${theme.headingFont}", sans-serif` };
  const bodyFont = { fontFamily: `"${theme.bodyFont}", monospace` };

  if (!product) {
    return <Teaser />;
  }

  const [heroImage, ...restImages] = product.images;
  const isSoldOut = product.status === "SOLD_OUT" || product.inventory <= 0;

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref([theme.headingFont, theme.bodyFont])} />
      <main
        className="flex flex-1 flex-col lg:flex-row"
        style={{ backgroundColor: theme.backgroundColor, color: theme.primaryColor }}
      >
        {/* Image side */}
        <div className="grain relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden border-white/5 p-8 lg:min-h-screen lg:border-r lg:p-16">
          {heroImage ? (
            <div className="relative aspect-[4/5] w-full max-w-lg">
              <Image
                src={heroImage.url}
                alt={heroImage.alt || product.name}
                fill
                priority
                className="object-cover shadow-[0_0_120px_-20px_rgba(0,0,0,0.8)]"
              />
              <div
                className="absolute -bottom-3 -right-3 border px-3 py-1 text-[10px] uppercase tracking-widest"
                style={{ borderColor: theme.accentColor, color: theme.accentColor, backgroundColor: theme.backgroundColor }}
              >
                Edition #{product.id.slice(-4).toUpperCase()}
              </div>
            </div>
          ) : (
            <div
              className="flex aspect-[4/5] w-full max-w-lg items-center justify-center border border-dashed text-xs uppercase tracking-widest text-white/30"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              No image yet
            </div>
          )}

          {restImages.length > 0 && (
            <div className="absolute bottom-8 left-8 hidden gap-2 sm:flex">
              {restImages.slice(0, 4).map((img) => (
                <div key={img.id} className="relative h-16 w-16 overflow-hidden border border-white/10">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info side */}
        <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-12 lg:max-w-xl lg:px-16">
          <p style={{ ...bodyFont, color: theme.accentColor }} className="text-xs uppercase tracking-[0.5em]">
            Lumina Drops
          </p>

          <h1 style={headingFont} className="mt-6 text-5xl uppercase leading-[0.95] sm:text-6xl">
            {product.name}
          </h1>

          {product.description && (
            <p style={bodyFont} className="mt-6 whitespace-pre-line text-sm leading-relaxed text-white/60">
              {product.description}
            </p>
          )}

          <div className="mt-10 flex items-baseline gap-4">
            <span style={headingFont} className="text-4xl">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.shippingCents > 0 && (
              <span style={bodyFont} className="text-xs text-white/40">
                + {formatPrice(product.shippingCents, product.currency)} shipping
              </span>
            )}
          </div>

          <p style={bodyFont} className="mt-2 text-xs uppercase tracking-widest text-white/40">
            {isSoldOut ? "Sold out" : `${product.inventory} left`}
          </p>

          <div className="mt-6 max-w-xs">
            <BuyButton
              productId={product.id}
              accentColor={theme.accentColor}
              backgroundColor={theme.backgroundColor}
              disabled={isSoldOut}
              label={isSoldOut ? "Sold out" : "Buy now"}
            />
          </div>
        </div>
      </main>
    </>
  );
}
