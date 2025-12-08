import { Trophy, Calendar, Building2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const wins = [
  {
    id: 1,
    tender: "Поставка оборудования для школ",
    customer: "Министерство образования",
    amount: "15 000 000 ₽",
    date: "10.01.2025",
    status: "Контракт подписан",
  },
  {
    id: 2,
    tender: "Строительство детской площадки",
    customer: "Администрация г. Москвы",
    amount: "8 500 000 ₽",
    date: "05.01.2025",
    status: "Контракт подписан",
  },
  {
    id: 3,
    tender: "IT-обслуживание",
    customer: "ПАО Газпром",
    amount: "25 000 000 ₽",
    date: "28.12.2024",
    status: "Исполнение",
  },
  {
    id: 4,
    tender: "Поставка канцелярии",
    customer: "Администрация Московской области",
    amount: "3 200 000 ₽",
    date: "20.12.2024",
    status: "Завершён",
  },
]

const statusColors: Record<string, string> = {
  "Контракт подписан": "bg-green-500/10 text-green-500 border-green-500/20",
  Исполнение: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Завершён: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

export default function ClientWinsPage() {
  const totalAmount = wins.reduce((sum, win) => {
    const amount = Number.parseInt(win.amount.replace(/[^\d]/g, ""))
    return sum + amount
  }, 0)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Всего побед</p>
                <p className="text-2xl font-bold text-foreground">{wins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Общая сумма</p>
                <p className="text-2xl font-bold text-foreground">{(totalAmount / 1000000).toFixed(1)}M ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">В исполнении</p>
                <p className="text-2xl font-bold text-foreground">
                  {wins.filter((w) => w.status === "Исполнение").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wins List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Выигранные тендеры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wins.map((win) => (
              <div
                key={win.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-secondary rounded-xl gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{win.tender}</p>
                    <p className="text-muted-foreground text-sm">{win.customer}</p>
                    <p className="text-muted-foreground text-xs mt-1">{win.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:ml-auto">
                  <div className="text-right">
                    <p className="text-foreground font-semibold">{win.amount}</p>
                    <Badge className={statusColors[win.status]}>{win.status}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
