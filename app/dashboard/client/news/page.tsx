import { Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const news = [
  {
    id: 1,
    title: "Новые условия получения банковских гарантий",
    description: "Банки-партнёры снизили требования к заёмщикам. Теперь получить гарантию стало проще.",
    date: "15.01.2025",
    category: "Гарантии",
    isNew: true,
  },
  {
    id: 2,
    title: "Изменения в 44-ФЗ",
    description: "Вступили в силу поправки к закону о госзакупках. Узнайте, что изменилось.",
    date: "12.01.2025",
    category: "Законодательство",
    isNew: true,
  },
  {
    id: 3,
    title: "Новые тендеры на платформе",
    description: "Добавлено более 500 новых тендеров в различных категориях.",
    date: "10.01.2025",
    category: "Тендеры",
    isNew: false,
  },
]

const categoryColors: Record<string, string> = {
  Гарантии: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Законодательство: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Тендеры: "bg-green-500/10 text-green-500 border-green-500/20",
}

export default function ClientNewsPage() {
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
