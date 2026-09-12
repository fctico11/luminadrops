"use client";

import { useEffect } from "react";
import { trackTikTokEvent } from "@/lib/tiktok-pixel";

type Props = {
  productId: string;
  productName: string;
  priceCents: number;
  currency: string;
};

export default function TrackViewContent({ productId, productName, priceCents, currency }: Props) {
  useEffect(() => {
    trackTikTokEvent("ViewContent", {
      contents: [{ content_id: productId, content_type: "product", content_name: productName }],
      value: priceCents / 100,
      currency: currency.toUpperCase(),
    });
    // Fires once per page load — not tied to quantity, since nothing's been
    // added to a cart yet at this point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
