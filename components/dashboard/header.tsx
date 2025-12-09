"use client"

import { Bell, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface DashboardHeaderProps {
  title: string
  onMenuClick?: () => void
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  
  const getProfileLink = () => {
    if (!user) return "/auth/login"
    const role = user.role
    if (role === "client") return "/dashboard/client/profile"
    if (role === "agent") return "/dashboard/agent/profile"
    if (role === "partner") return "/dashboard/partner/profile"
    return "/auth/login"
  }

  const getSettingsLink = () => {
    if (!user) return "/auth/login"
    const role = user.role
    if (role === "client") return "/dashboard/client/settings"
    if (role === "agent") return "/dashboard/agent/settings"
    if (role === "partner") return "/dashboard/partner/settings"
    return "/auth/login"
  }

  const handleLogout = () => {
    logout()
  }
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden !text-primary hover:!text-primary/80" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search - hidden on mobile */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
            <Input
              placeholder="Поиск..."
              className="w-64 pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground h-9"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative !text-primary hover:!text-primary/80">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="!text-primary hover:!text-primary/80">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
              <DropdownMenuLabel className="text-foreground">
                {user?.user?.last_name && user?.user?.first_name
                  ? `${user.user.last_name} ${user.user.first_name.charAt(0).toUpperCase()}.`
                  : "Мой аккаунт"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">
                <Link href={getSettingsLink()} className="w-full">
                  Настройки
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-destructive focus:bg-accent" onClick={handleLogout}>
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
