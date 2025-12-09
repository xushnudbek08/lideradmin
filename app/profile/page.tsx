"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function ProfileRedirectPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const role = user.role
        if (role === "client") {
          router.replace("/dashboard/client/profile")
        } else if (role === "agent") {
          router.replace("/dashboard/agent/profile")
        } else if (role === "partner") {
          router.replace("/dashboard/partner/profile")
        } else {
          router.replace("/auth/login")
        }
      } else {
        router.replace("/auth/login")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  )
}



