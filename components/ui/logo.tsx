import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
  src?: string
}

export function Logo({ className, size = 32, src = "/images/logo.png" }: LogoProps) {
  return (
    <Image
      src={src}
      alt="Logo"
      width={size}
      height={size}
      className={cn("object-contain flex-shrink-0", className)}
      priority
    />
  )
}

