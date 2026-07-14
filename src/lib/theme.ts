import { prisma } from "@/lib/prisma";

export type Theme = {
  headingFont: string;
  bodyFont: string;
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  logoUrl: string | null;
};

const FALLBACK_THEME: Theme = {
  headingFont: "Anton",
  bodyFont: "IBM Plex Mono",
  primaryColor: "#f5f2ea",
  backgroundColor: "#0a0a0a",
  accentColor: "#c9a227",
  logoUrl: null,
};

export async function getTheme(): Promise<Theme> {
  try {
    const theme = await prisma.themeSettings.findUnique({ where: { id: "default" } });
    return theme ?? FALLBACK_THEME;
  } catch {
    return FALLBACK_THEME;
  }
}

/** Builds a Google Fonts stylesheet URL for the given family names. */
export function googleFontsHref(families: string[]) {
  const unique = Array.from(new Set(families.filter(Boolean)));
  const query = unique
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700;800;900`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
