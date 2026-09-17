type IconProps = { className?: string };

/* Line-art icons, one per After Hours door. All draw with
   stroke="currentColor" so they inherit color from a wrapping text-color
   class, and share a 48x48 viewBox so they drop into DoorFrame at any size. */

/** A tiny 4-point sparkle, reused at small scale as a decorative accent
 * along a few of the icons below (the swirl trail, the wax seal). */
function tinyStar(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r} L${cx + r * 0.28} ${cy - r * 0.28} L${cx + r} ${cy} L${cx + r * 0.28} ${cy + r * 0.28} L${cx} ${cy + r} L${cx - r * 0.28} ${cy + r * 0.28} L${cx - r} ${cy} L${cx - r * 0.28} ${cy - r * 0.28} Z`;
}

/** A scalloped ring — a wax-seal-style wavy edge — built from `bumps` outward
 * bulges around a circle of radius `r`, rather than a plain smooth circle. */
function scallopedRing(cx: number, cy: number, r: number, bumps: number, depth: number) {
  const pts = Array.from({ length: bumps + 1 }, (_, i) => {
    const a = (i / bumps) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  let d = `M ${pts[0][0]} ${pts[0][1]} `;
  for (let i = 0; i < bumps; i++) {
    const mid = ((i + 0.5) / bumps) * Math.PI * 2;
    const bx = cx + (r + depth) * Math.cos(mid);
    const by = cy + (r + depth) * Math.sin(mid);
    d += `Q ${bx} ${by} ${pts[i + 1][0]} ${pts[i + 1][1]} `;
  }
  return d;
}

export function FrameIcon({ className }: IconProps) {
  const curl = "M0 0 C1.3 -1.6 3.2 -1.5 3.1 0.4 C3 2.2 1.3 2.6 0.4 1.5";
  const corners: [number, number, number][] = [
    [11, 7.5, 0],
    [37, 7.5, 90],
    [37, 40.5, 180],
    [11, 40.5, 270],
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d="M24 3.5 v3" strokeLinecap="round" />
      <circle cx="24" cy="2.6" r="1.1" />
      <rect x="11" y="7.5" width="26" height="33" rx="1" />
      <rect x="15" y="11.7" width="18" height="24.6" rx="0.6" />
      {corners.map(([x, y, rot]) => (
        <path key={rot} d={curl} strokeWidth="0.85" opacity="0.8" transform={`translate(${x} ${y}) rotate(${rot})`} />
      ))}
      <path d="M24 16.5 L25.4 21.6 L30.5 23 L25.4 24.4 L24 29.5 L22.6 24.4 L17.5 23 L22.6 21.6 Z" />
    </svg>
  );
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

export function ChestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      {/* leaning book, propped against the chest */}
      <rect x="6.5" y="21" width="8" height="17" rx="0.7" transform="rotate(-15 6.5 21)" />
      <path d="M8.2 22.4 L15 24.6" transform="rotate(-15 6.5 21)" strokeWidth="0.7" opacity="0.7" />
      <path d="M7.6 25 L14.4 27.2" transform="rotate(-15 6.5 21)" strokeWidth="0.5" opacity="0.5" />
      {/* chest, flat-top */}
      <rect x="17" y="23" width="24" height="15" rx="1" />
      {/* ribbon down the center + bow at the top edge */}
      <path d="M29 17 v21" />
      <path d="M29 17.3 c-3.1 -1.4 -3.1 -4 0 -4.6 c1.6 -0.3 1.6 2 0 2.3 M29 17.3 c3.1 -1.4 3.1 -4 0 -4.6 c-1.6 -0.3 -1.6 2 0 2.3" />
      <circle cx="29" cy="17.2" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SealIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
      <path d={scallopedRing(23, 22, 12.5, 20, 1.4)} />
      <circle cx="23" cy="22" r="9" />
      <path d="M23 16 L24.6 20.4 L29 22 L24.6 23.6 L23 28 L21.4 23.6 L17 22 L21.4 20.4 Z" />
      <circle cx="33" cy="33" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="36.5" cy="36.5" r="0.9" fill="currentColor" stroke="none" />
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

export function AppleMusicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <path d="M10 15.2a1.9 1.9 0 1 1 -1.9 -1.9c0.4 0 0.8 0.1 1.1 0.3" strokeLinecap="round" />
      <path d="M15.6 13.6a1.9 1.9 0 1 1 -1.9 -1.9c0.4 0 0.8 0.1 1.1 0.3" strokeLinecap="round" />
      <path d="M10 13.6V8.4l5.6 -1.2v5.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
