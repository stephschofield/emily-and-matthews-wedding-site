import type { SVGProps } from "react"

export function FleurDeLis(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v20M12 6c0-2 1-3 3-3s3 1 3 3c0 1.5-1 2.5-3 3 2 .5 3 1.5 3 3 0 2-1 3-3 3s-3-1-3-3" />
      <path d="M12 6c0-2-1-3-3-3S6 4 6 6c0 1.5 1 2.5 3 3-2 .5-3 1.5-3 3 0 2 1 3 3 3s3-1 3-3" />
      <path d="M12 17c0 1 .5 2 2 2s2-1 2-2c0-.5-.25-1-.5-1.5-.25.5-.75 1-1.5 1s-1.25-.5-1.5-1c-.25.5-.5 1-.5 1.5z" />
      <path d="M12 17c0 1-.5 2-2 2s-2-1-2-2c0-.5.25-1 .5-1.5.25.5.75 1 1.5 1s1.25-.5 1.5-1c.25.5.5 1 .5 1.5z" />
    </svg>
  )
}
