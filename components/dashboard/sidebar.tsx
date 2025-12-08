"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Building2,
  FileText,
  Calculator,
  Users,
  Settings,
  FileSignature,
  Newspaper,
  PlusCircle,
  Award,
  Landmark,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { useState } from "react"

export type UserRole = "client" | "agent" | "partner"

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

const menuItems: Record<UserRole, MenuItem[]> = {
  agent: [
    { label: "Компания", href: "/dashboard/agent", icon: Building2 },
    { label: "Мои заявки", href: "/dashboard/agent/applications", icon: FileText },
    { label: "Калькулятор", href: "/dashboard/agent/calculator", icon: Calculator },
    { label: "Клиенты", href: "/dashboard/agent/clients", icon: Users },
    { label: "Настройка", href: "/dashboard/agent/settings", icon: Settings },
    { label: "Мой договор", href: "/dashboard/agent/contract", icon: FileSignature },
    { label: "Индивидуальное рассмотрение", href: "/dashboard/agent/individual", icon: UserCheck },
    { label: "Новости", href: "/dashboard/agent/news", icon: Newspaper },
    { label: "Чат", href: "/dashboard/agent/chat", icon: MessageCircle },
  ],
  client: [
    { label: "Аккредитация", href: "/dashboard/client", icon: Award },
    { label: "Моя компания", href: "/dashboard/client/company", icon: Building2 },
    { label: "Мои документы", href: "/dashboard/client/documents", icon: FileText },
    { label: "Мои заявки", href: "/dashboard/client/applications", icon: FileSignature },
    { label: "Мои победы", href: "/dashboard/client/wins", icon: Award },
    { label: "Калькулятор", href: "/dashboard/client/calculator", icon: Calculator },
    { label: "Новости", href: "/dashboard/client/news", icon: Newspaper },
    { label: "Чат", href: "/dashboard/client/chat", icon: MessageCircle },
  ],
  partner: [
    { label: "Мой банк / МФО", href: "/dashboard/partner", icon: Landmark },
    { label: "Мои клиенты", href: "/dashboard/partner/clients", icon: Users },
    { label: "Мои агенты", href: "/dashboard/partner/agents", icon: UserCheck },
    { label: "Мои заявки", href: "/dashboard/partner/applications", icon: FileText },
    { label: "Новости", href: "/dashboard/partner/news", icon: Newspaper },
    { label: "Чат", href: "/dashboard/partner/chat", icon: MessageCircle },
  ],
}

interface SidebarProps {
  role: UserRole
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const items = menuItems[role]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} className="flex-shrink-0" />
              <span className="text-lg font-bold text-sidebar-foreground">ЛидерГарант</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="w-8 h-8 flex items-center justify-center mx-auto">
              <Logo size={32} className="flex-shrink-0" />
            </Link>
          )}
        </div>

        {/* Create Application Button */}
        <div className="p-4">
          <Button
            asChild
            className={cn("w-full bg-primary text-primary-foreground hover:bg-primary/90", isCollapsed && "px-2")}
          >
            <Link href={`/dashboard/${role}/create-application`}>
              <PlusCircle className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Создать заявку</span>}
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isCollapsed && "justify-center px-2",
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Manager info (only for agent) */}
        {role === "agent" && !isCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-sidebar-accent rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Ваш менеджер</p>
              <p className="text-sm font-medium text-sidebar-foreground">Д. Сергеев</p>
            </div>
          </div>
        )}

        {/* Collapse button and logout */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className={cn("w-full text-sidebar-foreground hover:bg-sidebar-accent", isCollapsed && "px-2")}
            asChild
          >
            <Link href="/auth/login">
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Выйти</span>}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full text-muted-foreground hover:text-sidebar-foreground"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!isCollapsed && <span className="ml-2">Свернуть</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
