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

  const handleLogout = () => {
    logout()
  }
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search - hidden on mobile */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="w-64 pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
              <DropdownMenuLabel className="text-foreground">Мой аккаунт</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">
                <Link href={getProfileLink()} className="w-full">
                  Профиль
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">
                <Link href="/settings" className="w-full">
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
