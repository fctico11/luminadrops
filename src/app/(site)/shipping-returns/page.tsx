import { getContent } from "@/lib/content";
import PolicyView from "../policy-view";

export const metadata = {
  title: "Shipping & Returns — Lumina Drops",
  description: "Shipping, order limits, and returns for Lumina Drops.",
};

export default function ShippingReturnsPage() {
  const content = getContent("shipping-returns");
  return <PolicyView contentName="shipping-returns" content={content} />;
}
