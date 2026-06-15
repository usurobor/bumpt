// Triangular-pyramid (tetrahedron) wordmark — line art, inherits color via currentColor.
export function Pyramid({ size = 88 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* front face: apex → front-left → front-right */}
      <polygon points="50,8 12,86 88,86" />
      {/* edges to the back vertex, for depth */}
      <line x1="50" y1="8" x2="50" y2="62" />
      <line x1="12" y1="86" x2="50" y2="62" />
      <line x1="88" y1="86" x2="50" y2="62" />
    </svg>
  );
}
