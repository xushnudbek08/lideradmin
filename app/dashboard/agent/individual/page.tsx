"use client"

import { useState } from "react"
import { UserCheck, Search, Plus, FileText, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const individualRequests = [
  {
    id: 1,
    client: "ООО Техносервис",
    inn: "7712345678",
    requestType: "Индивидуальные условия",
    amount: "15 000 000 ₽",
    status: "На рассмотрении",
    date: "15.01.2025",
    description: "Запрос на индивидуальные условия финансирования",
  },
  {
    id: 2,
    client: "ИП Петров А.С.",
    inn: "771234567890",
    requestType: "Особые условия",
    amount: "5 000 000 ₽",
    status: "Одобрено",
    date: "14.01.2025",
    description: "Запрос на особые условия для долгосрочного сотрудничества",
  },
]

const statusColors: Record<string, string> = {
  "На рассмотрении": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Одобрено: "bg-green-500/10 text-green-500 border-green-500/20",
  Отклонено: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function IndividualReviewPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRequests = individualRequests.filter((req) => {
    const matchesSearch =
      req.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.inn.includes(searchQuery) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || req.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Индивидуальное рассмотрение</h1>
          <p className="text-muted-foreground mt-1">Заявки на индивидуальные условия финансирования</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Создать запрос
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по клиенту, ИНН или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-border text-foreground">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="На рассмотрении">На рассмотрении</SelectItem>
                <SelectItem value="Одобрено">Одобрено</SelectItem>
                <SelectItem value="Отклонено">Отклонено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground">{request.client}</CardTitle>
                  <CardDescription>ИНН: {request.inn}</CardDescription>
                </div>
                <Badge className={statusColors[request.status]}>{request.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Тип запроса</p>
                  <p className="text-foreground font-medium">{request.requestType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Сумма</p>
                  <p className="text-foreground font-medium">{request.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Дата</p>
                  <p className="text-foreground font-medium">{request.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Описание</p>
                <p className="text-foreground">{request.description}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="border-border text-foreground bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Подробнее
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <UserCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Нет запросов</h3>
            <p className="text-muted-foreground">Заявки на индивидуальное рассмотрение будут отображаться здесь</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

