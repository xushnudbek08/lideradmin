import { Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const news = [
  {
    id: 1,
    title: "Новые условия кредитования от Сбербанка",
    description: "Сбербанк обновил условия кредитования для малого и среднего бизнеса. Ставка снижена до 12% годовых.",
    date: "15.01.2025",
    category: "Банки",
    isNew: true,
  },
  {
    id: 2,
    title: "Изменения в программе господдержки",
    description: "С 1 февраля вступают в силу новые правила получения субсидий для предпринимателей.",
    date: "14.01.2025",
    category: "Госпрограммы",
    isNew: true,
  },
  {
    id: 3,
    title: "ВТБ запускает новый продукт для ИП",
    description: "Банк ВТБ представил новую программу кредитования для индивидуальных предпринимателей.",
    date: "12.01.2025",
    category: "Банки",
    isNew: false,
  },
  {
    id: 4,
    title: "Обновление платформы ЛидерГарант",
    description: "Мы добавили новые функции в личный кабинет агента: улучшенный калькулятор и отчёты.",
    date: "10.01.2025",
    category: "Платформа",
    isNew: false,
  },
]

const categoryColors: Record<string, string> = {
  Банки: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Госпрограммы: "bg-green-500/10 text-green-500 border-green-500/20",
  Платформа: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export default function AgentNewsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={categoryColors[item.category]}>{item.category}</Badge>
                    {item.isNew && <Badge className="bg-accent/10 text-accent border-accent/20">Новое</Badge>}
                  </div>
                  <CardTitle className="text-foreground text-lg leading-tight">{item.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {item.date}
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  Подробнее
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
