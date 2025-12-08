import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Clock, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Финансовый маркетплейс</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
            Создайте заявку на финансирование за <span className="text-primary">5 минут</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Для клиентов, агентов и банковских партнёров. Удобная платформа для работы с финансовыми продуктами.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Link href="/auth/login">
                Перейти в личный кабинет
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary text-lg px-8 py-6 bg-transparent"
            >
              <Link href="#services">Узнать больше</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-foreground">500+</span>
              <span className="text-muted-foreground text-sm">Активных клиентов</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-foreground">50+</span>
              <span className="text-muted-foreground text-sm">Банков-партнёров</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-foreground">24/7</span>
              <span className="text-muted-foreground text-sm">Поддержка</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
