"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "О компании", href: "#about" },
    { label: "Услуги", href: "#services" },
    { label: "Банк-партнёры", href: "#partners" },
    { label: "Контакты", href: "#contacts" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="ЛидерГарант Logo"
              width={48}
              height={48}
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
            />
            <span className="text-xl font-bold text-foreground hidden sm:block">ЛидерГарант</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <a
              href="tel:+78001234567"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">8 800 123-45-67</span>
            </a>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <MessageCircle className="w-5 h-5" />
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                <Link href="/auth/login">Вход</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/auth/register">Регистрация</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="ghost" asChild className="justify-start text-muted-foreground">
                  <Link href="/auth/login">Вход</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground">
                  <Link href="/auth/register">Регистрация</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
