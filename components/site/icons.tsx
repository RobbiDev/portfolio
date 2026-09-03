/**
 * Inline SVG icons. The design's mockup stood in Unicode symbols (✳, ⚡, ✕…)
 * for artwork that should be drawn, so everything user-facing is a real icon
 * here — no emoji, no glyph fonts.
 *
 * Each icon inherits `currentColor` and sizes to 1em, so the existing rules
 * that set `font-size` on a marker keep controlling how big it renders.
 */

interface IconProps {
  className?: string
  strokeWidth?: number
}

function Svg({
  className,
  children,
  strokeWidth = 2,
  fill = "none",
}: IconProps & { children: React.ReactNode; fill?: string }) {
  return (
    <svg
      className={`rj-icon${className ? ` ${className}` : ""}`}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/**
 * The house mark: the eight-spoked star on the Learn button, the menu orb and
 * the mosaic band. Drawn rather than set as a glyph, which iOS renders as a
 * full-colour emoji tile.
 */
export function StarIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.7}>
      <path d="M12 1.6v20.8M1.6 12h20.8M4.65 4.65l14.7 14.7M19.35 4.65 4.65 19.35" />
    </Svg>
  )
}

/** Six-spoked variant, for the mosaic's second mark. */
export function AsteriskIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5v19M3.8 7.25l16.4 9.5M20.2 7.25 3.8 16.75" />
    </Svg>
  )
}

/** Quick Look. */
export function BoltIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </Svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5 19 19M19 5 5 19" />
    </Svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  )
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Svg>
  )
}

/* ── callout markers ─────────────────────────────────────────────────────── */

export function InfoIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 2.4}>
      <path d="M12 11v6M12 7h.01" />
    </Svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 1.8}>
      <path d="M12 3c0 4.97 4.03 9 9 9-4.97 0-9 4.03-9 9 0-4.97-4.03-9-9-9 4.97 0 9-4.03 9-9Z" />
    </Svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props} strokeWidth={props.strokeWidth ?? 2.4}>
      <path d="M12 7v6M12 17h.01" />
    </Svg>
  )
}
