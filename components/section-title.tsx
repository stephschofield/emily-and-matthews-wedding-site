import type { ReactNode } from "react"
import { FloralDivider } from "@/components/floral-divider"

interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="text-center mb-12 relative">
      <h2 className="text-4xl md:text-5xl font-cormorant text-navy mb-6 font-light tracking-wide">{children}</h2>
      <div className="flex items-center justify-center">
        <FloralDivider className="text-sage h-8 w-auto" />
      </div>
    </div>
  )
}
