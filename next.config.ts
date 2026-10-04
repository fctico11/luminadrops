import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    // 75 is Next's default; 90 is used for the small bespoke TMMC door art,
    // where extra quality headroom avoids compression artifacts on dense
    // line work (see src/app/tmmc/door.tsx).
    qualities: [75, 90],
    // demo drop artwork in /public is SVG
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // The teaser landing page is shelved (still editable at /admin/edit), so the
  // bare domain goes straight to the product page. Temporary (307) since the
  // teaser may come back; query strings like TikTok's ttclid pass through.
  async redirects() {
    return [{ source: "/", destination: "/drop01", permanent: false }];
  },
};

export default nextConfig;
