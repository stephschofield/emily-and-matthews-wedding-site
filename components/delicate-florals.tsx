import type { SVGProps } from "react"

export function DelicateSprigLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Main branch */}
      <path
        d="M10 30 Q25 25 40 30 Q55 35 70 30"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small leaves along the branch */}
      <ellipse cx="20" cy="25" rx="4" ry="8" fill="currentColor" opacity="0.8" transform="rotate(-20 20 25)" />
      <ellipse cx="30" cy="32" rx="3" ry="6" fill="currentColor" opacity="0.7" transform="rotate(15 30 32)" />
      <ellipse cx="45" cy="28" rx="4" ry="7" fill="currentColor" opacity="0.8" transform="rotate(-10 45 28)" />
      <ellipse cx="55" cy="35" rx="3" ry="5" fill="currentColor" opacity="0.7" transform="rotate(25 55 35)" />

      {/* Small buds */}
      <circle cx="15" cy="28" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="35" cy="29" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="60" cy="32" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function DelicateSprigRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Main branch - mirrored */}
      <path
        d="M70 30 Q55 25 40 30 Q25 35 10 30"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small leaves along the branch - mirrored */}
      <ellipse cx="60" cy="25" rx="4" ry="8" fill="currentColor" opacity="0.8" transform="rotate(20 60 25)" />
      <ellipse cx="50" cy="32" rx="3" ry="6" fill="currentColor" opacity="0.7" transform="rotate(-15 50 32)" />
      <ellipse cx="35" cy="28" rx="4" ry="7" fill="currentColor" opacity="0.8" transform="rotate(10 35 28)" />
      <ellipse cx="25" cy="35" rx="3" ry="5" fill="currentColor" opacity="0.7" transform="rotate(-25 25 35)" />

      {/* Small buds - mirrored */}
      <circle cx="65" cy="28" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="45" cy="29" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="32" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function DelicateSprigTop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Curved branch */}
      <path
        d="M30 35 Q25 20 15 10 M30 35 Q35 20 45 10"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaves */}
      <ellipse cx="20" cy="15" rx="3" ry="6" fill="currentColor" opacity="0.8" transform="rotate(-30 20 15)" />
      <ellipse cx="40" cy="15" rx="3" ry="6" fill="currentColor" opacity="0.8" transform="rotate(30 40 15)" />
      <ellipse cx="25" cy="25" rx="2" ry="4" fill="currentColor" opacity="0.7" transform="rotate(-15 25 25)" />
      <ellipse cx="35" cy="25" rx="2" ry="4" fill="currentColor" opacity="0.7" transform="rotate(15 35 25)" />

      {/* Small buds */}
      <circle cx="18" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="42" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function DelicateSprigBottom(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Curved branch - inverted */}
      <path
        d="M30 5 Q25 20 15 30 M30 5 Q35 20 45 30"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaves - inverted */}
      <ellipse cx="20" cy="25" rx="3" ry="6" fill="currentColor" opacity="0.8" transform="rotate(30 20 25)" />
      <ellipse cx="40" cy="25" rx="3" ry="6" fill="currentColor" opacity="0.8" transform="rotate(-30 40 25)" />
      <ellipse cx="25" cy="15" rx="2" ry="4" fill="currentColor" opacity="0.7" transform="rotate(15 25 15)" />
      <ellipse cx="35" cy="15" rx="2" ry="4" fill="currentColor" opacity="0.7" transform="rotate(-15 35 15)" />

      {/* Small buds - inverted */}
      <circle cx="18" cy="28" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="42" cy="28" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="30" cy="10" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function DelicateFloralFrame(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Left side botanical elements */}
      <path
        d="M20 40 Q35 30 50 40 Q65 50 80 40"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Right side botanical elements */}
      <path
        d="M120 40 Q135 30 150 40 Q165 50 180 40"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left leaves */}
      <ellipse cx="30" cy="35" rx="3" ry="7" fill="currentColor" opacity="0.8" transform="rotate(-20 30 35)" />
      <ellipse cx="45" cy="45" rx="2.5" ry="5" fill="currentColor" opacity="0.7" transform="rotate(15 45 45)" />
      <ellipse cx="60" cy="38" rx="3" ry="6" fill="currentColor" opacity="0.8" transform="rotate(-10 60 38)" />
      <ellipse cx="70" cy="45" rx="2" ry="4" fill="currentColor" opacity="0.7" transform="rotate(25 70 45)" />

      {/* Right leaves */}
      <ellipse cx="130" cy="35" rx="3" ry="7" fill="currentColor" opacity="0.8" transform="rotate(20 130 35)" />
      <ellipse cx="145" cy="45" rx="2.5" ry="5" fill="currentColor" opacity="0.7" transform="rotate(-15 145 45)" />
      <ellipse cx="160" cy="38" rx="3" ry="6" fill="currentColor" opacity="0.8" transform="rotate(10 160 38)" />
      <ellipse cx="170" cy="45" rx="2" ry="4" fill="currentColor" opacity="0.7" transform="rotate(-25 170 45)" />

      {/* Small buds */}
      <circle cx="25" cy="38" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="40" cy="42" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="55" cy="40" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="75" cy="42" r="1.5" fill="currentColor" opacity="0.6" />

      <circle cx="125" cy="38" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="140" cy="42" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="155" cy="40" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="175" cy="42" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
