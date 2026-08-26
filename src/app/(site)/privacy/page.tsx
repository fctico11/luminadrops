import { getContent } from "@/lib/content";
import PolicyView from "../policy-view";

export const metadata = {
  title: "Privacy Policy — Lumina Drops",
  description: "How Lumina Drops collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  const content = getContent("privacy");
  return <PolicyView contentName="privacy" content={content} />;
}
