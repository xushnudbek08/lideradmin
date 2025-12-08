"use client"

import { useState } from "react"
import { Search, Filter, Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const applications = [
  {
    id: "ZAY-001",
    company: "ООО Техносервис",
    inn: "7712345678",
    amount: "5 000 000 ₽",
    bank: "Сбербанк",
    status: "На рассмотрении",
    date: "15.01.2025",
    type: "Юр. Лицо",
  },
  {
    id: "ZAY-002",
    company: "ИП Петров А.С.",
    inn: "771234567890",
    amount: "1 500 000 ₽",
    bank: "ВТБ",
    status: "Одобрено",
    date: "14.01.2025",
    type: "ИП",
  },
  {
    id: "ZAY-003",
    company: "ООО СтройМастер",
    inn: "7787654321",
    amount: "10 000 000 ₽",
    bank: "Альфа-Банк",
    status: "В работе",
    date: "13.01.2025",
    type: "Юр. Лицо",
  },
  {
    id: "ZAY-004",
    company: "ООО ТрансЛогистик",
    inn: "7798765432",
    amount: "3 200 000 ₽",
    bank: "Газпромбанк",
    status: "Отклонено",
    date: "12.01.2025",
    type: "Юр. Лицо",
  },
  {
    id: "ZAY-005",
    company: "ИП Сидорова Н.М.",
    inn: "772345678901",
    amount: "800 000 ₽",
    bank: "Россельхозбанк",
    status: "Одобрено",
    date: "11.01.2025",
    type: "ИП",
  },
]

const statusColors: Record<string, string> = {
  "На рассмотрении": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Одобрено: "bg-green-500/10 text-green-500 border-green-500/20",
  "В работе": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Отклонено: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function AgentApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.inn.includes(searchQuery)

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру, компании или ИНН..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-border text-foreground">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="На рассмотрении">На рассмотрении</SelectItem>
                <SelectItem value="В работе">В работе</SelectItem>
                <SelectItem value="Одобрено">Одобрено</SelectItem>
                <SelectItem value="Отклонено">Отклонено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Мои заявки ({filteredApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">№ Заявки</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Компания</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">ИНН</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Тип</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Сумма</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Банк</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Статус</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Дата</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 text-sm text-primary font-medium">{app.id}</td>
                    <td className="py-4 text-sm text-foreground">{app.company}</td>
                    <td className="py-4 text-sm text-muted-foreground">{app.inn}</td>
                    <td className="py-4 text-sm text-foreground">{app.type}</td>
                    <td className="py-4 text-sm text-foreground font-medium">{app.amount}</td>
                    <td className="py-4 text-sm text-foreground">{app.bank}</td>
                    <td className="py-4">
                      <Badge className={statusColors[app.status]}>{app.status}</Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{app.date}</td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="text-foreground">
                            <Eye className="w-4 h-4 mr-2" />
                            Просмотр
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
