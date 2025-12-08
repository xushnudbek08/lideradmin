import type React from "react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">Л</span>
            </div>
            <span className="text-xl font-bold text-foreground">ЛидерГарант</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Финансовый маркетплейс для бизнеса</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Создайте заявку на финансирование за 5 минут. Для клиентов, агентов и банковских партнёров.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-muted-foreground">ЛидерГарант © 2025</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
