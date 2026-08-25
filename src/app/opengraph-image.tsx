import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141115",
          color: "#e9e1cd",
          fontFamily: "serif",
        }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="#cfc6b1">
          <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8Z" />
        </svg>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: 14,
          }}
        >
          LUMINA DROPS
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            width: 860,
            fontSize: 30,
            lineHeight: 1.5,
            textAlign: "center",
            color: "#c4bba8",
          }}
        >
          Limited releases, each beginning with an idea we couldn&apos;t leave imaginary.
        </div>
      </div>
    ),
    { ...size }
  );
}
