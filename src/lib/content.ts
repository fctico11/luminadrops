import "server-only";
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

export type Tile = { src: string; alt: string };
export type Fact = { term: string; detail: string };

export type TeaserContent = {
  wordmark: string;
  dropLabel: string;
  headline: string;
  dateLabel: string;
  stats: string[];
  sectionTitle: string;
  sectionLead: string;
  sectionBody: string;
  footerLabel: string;
  footerButton: string;
  tiles: Tile[];
};

export type SiteHeaderContent = {
  wordmark: string;
  navLabels: { drops: string; archive: string; about: string };
};

export type HomeContent = {
  wordmarkLine1: string;
  wordmarkLine2: string;
  tagline: string;
  dropLabel: string;
  subheadingLine1: string;
  subheadingLine2: string;
  ctaLabel: string;
  footerNote: string;
};

export type AboutContent = {
  title: string;
  lead: string;
  body: string;
  facts: Fact[];
  ctaLabel: string;
};

export type ArchiveContent = {
  title: string;
  emptyLabel: string;
  emptyBody: string;
  ctaLabel: string;
};

export type DropsContent = {
  eyebrow: string;
  backgroundImage: string;
  dropLabel: string;
  titleLine1: string;
  titleLine2: string;
  dateLabel: string;
  ctaLabel: string;
  footerNote: string;
};

export type CartContent = {
  title: string;
  emptyLead: string;
  emptyBody: string;
  ctaLabel: string;
};

export type SuccessContent = {
  eyebrow: string;
  title: string;
  bodyWithEmail: string;
  bodyNoEmail: string;
  shippingNote: string;
  backLabel: string;
};

export type WaitlistContent = {
  triggerLabel: string;
  modalTitle: string;
  modalBody: string;
  emailPlaceholder: string;
  consentLabel: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  closeLabel: string;
};

export type ProductPageContent = {
  eyebrow: string;
  noImageLabel: string;
};

export type Drop01Item = { image: string; alt: string; title: string; description: string; note: string };
export type Drop01Badge = { icon: string; iconAlt: string; line1: string; line2: string };

export type Drop01Content = {
  dropLabel: string;
  titleLine1: string;
  titleLine2: string;
  titleImage: string;
  titleImageAlt: string;
  tagline: string;
  dateLabel: string;
  heroImage: string;
  heroImageAlt: string;
  insideSectionTitle: string;
  insideParagraph1: string;
  insideParagraph2: string;
  insideParagraph3: string;
  insideClosingLine: string;
  includesTitle: string;
  items: Drop01Item[];
  includesClosingLine: string;
  badges: Drop01Badge[];
  purchaseImage: string;
  purchaseImageAlt: string;
  quantityLabel: string;
  ctaLabel: string;
  priceLabel: string;
  footNote1: string;
  footNote2: string;
};

export type ContentMap = {
  teaser: TeaserContent;
  "site-header": SiteHeaderContent;
  home: HomeContent;
  about: AboutContent;
  archive: ArchiveContent;
  drops: DropsContent;
  cart: CartContent;
  success: SuccessContent;
  waitlist: WaitlistContent;
  "product-page": ProductPageContent;
  drop01: Drop01Content;
};

export type ContentName = keyof ContentMap;

export function contentPath(name: ContentName) {
  return path.join(CONTENT_DIR, `${name}.json`);
}

export function getContent<K extends ContentName>(name: K): ContentMap[K] {
  const raw = fs.readFileSync(contentPath(name), "utf-8");
  return JSON.parse(raw) as ContentMap[K];
}

export function writeContent<K extends ContentName>(name: K, data: ContentMap[K]) {
  fs.writeFileSync(contentPath(name), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/** Sets a (possibly nested/array) field on a content object, given a dot-path like
 * "navLabels.drops" or "stats.0" or "tiles.2.alt". Used by the admin save action to
 * apply edits collected from the client without knowing each shape in advance. */
export function setByPath(target: Record<string, unknown>, dotPath: string, value: unknown) {
  const keys = dotPath.split(".");
  let cursor: Record<string, unknown> = target;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = cursor[key];
    if (typeof next !== "object" || next === null) {
      throw new Error(`Invalid content path "${dotPath}": "${key}" is not an object`);
    }
    cursor = next as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
}
