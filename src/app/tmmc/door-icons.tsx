type IconProps = { className?: string };

/* Line-art icons, one per After Hours door. All draw with
   stroke="currentColor" so they inherit color from a wrapping text-color
   class, and share a 48x48 viewBox so they drop into DoorFrame at any size. */

/** A tiny 4-point sparkle, reused at small scale as a decorative accent
 * along a few of the icons below (the swirl trail). */
function tinyStar(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r} L${cx + r * 0.28} ${cy - r * 0.28} L${cx + r} ${cy} L${cx + r * 0.28} ${cy + r * 0.28} L${cx} ${cy + r} L${cx - r * 0.28} ${cy + r * 0.28} L${cx - r} ${cy} L${cx - r * 0.28} ${cy - r * 0.28} Z`;
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M23 9.5 a3.6 3.6 0 1 0 5.1 5 a4.8 4.8 0 1 1 -5.1 -5 Z" fill="currentColor" stroke="none" opacity="0.9" />
      <path
        d="M13.5 39 C8.5 40.8 5 37.6 8.6 34.6 C11.5 32.2 15.2 34.6 13 37.6 C11.6 39.5 8.7 38.9 9 36.8"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d={tinyStar(12.5, 32, 1.1)} fill="currentColor" stroke="none" opacity="0.8" />
      <path d={tinyStar(16.5, 36.5, 0.8)} fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M16 32 L31.5 11.5 L36.5 15.5 L21 36 L14.5 38 Z" />
      <path d="M31.5 11.5 L36.5 15.5" />
      <path d="M18.3 29 L22.3 32" />
    </svg>
  );
}

export function SpotifyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M6.5 9.8c3.5-1 8-0.6 11 1.1" strokeLinecap="round" />
      <path d="M7 13.1c2.9-0.8 6.6-0.5 9.1 0.9" strokeLinecap="round" />
      <path d="M7.6 16.2c2.4-0.6 5.3-0.4 7.3 0.8" strokeLinecap="round" />
    </svg>
  );
}
