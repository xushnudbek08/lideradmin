"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar, type UserRole } from "./sidebar"

interface MobileSidebarProps {
  role: UserRole
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ role, isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
        <div className="relative h-full">
          <Sidebar role={role} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  )
}
