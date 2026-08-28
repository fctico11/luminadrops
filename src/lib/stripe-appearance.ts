import type { Appearance, CssFontSource } from "@stripe/stripe-js";

/** Theme for the embedded Stripe Elements checkout so it reads as part of the
 * site rather than a bolted-on payment widget — same palette and sharp
 * (non-rounded) edges as the rest of Lumina Drops. */
export const checkoutAppearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#e9e1cd",
    colorBackground: "#141115",
    colorText: "#e9e1cd",
    colorTextSecondary: "#9c9384",
    colorTextPlaceholder: "#6f695c",
    colorDanger: "#e07a5f",
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSizeBase: "17px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Label": {
      color: "#9c9384",
      fontSize: "12px",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginBottom: "6px",
    },
    ".Input": {
      backgroundColor: "transparent",
      border: "1px solid #4c4740",
      boxShadow: "none",
      padding: "12px 14px",
      fontSize: "17px",
    },
    ".Input:focus": {
      border: "1px solid #cfc0a0",
      boxShadow: "none",
    },
    ".Tab": {
      backgroundColor: "transparent",
      border: "1px solid #4c4740",
      boxShadow: "none",
    },
    ".Tab:hover": {
      border: "1px solid #6f695c",
    },
    ".Tab--selected": {
      backgroundColor: "rgba(233, 225, 205, 0.04)",
      border: "1px solid #cfc0a0",
      boxShadow: "none",
    },
    ".TabLabel": {
      color: "#e9e1cd",
    },
    ".Block": {
      backgroundColor: "transparent",
      border: "1px solid #4c4740",
      boxShadow: "none",
    },
  },
};

export const checkoutFonts: CssFontSource[] = [
  {
    cssSrc: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap",
  },
];
