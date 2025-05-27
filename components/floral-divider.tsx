import type { SVGProps } from "react"

export function FloralDivider(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="280" height="40" viewBox="0 0 280 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10,20 L120,20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M160,20 L270,20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

      {/* Central floral element */}
      <circle cx="140" cy="20" r="10" fill="currentColor" opacity="0.1" />
      <circle cx="140" cy="20" r="6" fill="currentColor" opacity="0.2" />
      <circle cx="140" cy="20" r="3" fill="currentColor" opacity="0.7" />

      {/* Left side decorations */}
      <circle cx="100" cy="20" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="80" cy="20" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="20" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="40" cy="20" r="1" fill="currentColor" opacity="0.2" />

      {/* Right side decorations */}
      <circle cx="180" cy="20" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="200" cy="20" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="220" cy="20" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="240" cy="20" r="1" fill="currentColor" opacity="0.2" />

      {/* Leaf elements */}
      <path d="M130,15 Q135,5 140,15" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M150,15 Q145,5 140,15" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M130,25 Q135,35 140,25" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M150,25 Q145,35 140,25" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}
