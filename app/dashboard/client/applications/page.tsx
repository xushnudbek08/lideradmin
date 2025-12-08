"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { applicationsApi } from "@/lib/api"
import { useRouter } from "next/navigation"

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  submitted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  under_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  submitted: "Отправлено",
  under_review: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
}

export default function ClientApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await applicationsApi.getMyApplications()
        const formatted = data.map((app) => ({
          id: app.id,
          idDisplay: `ZAY-${String(app.id).padStart(3, "0")}`,
          type: app.title || "Банковская гарантия",
          amount: app.amount ? `${parseFloat(app.amount).toLocaleString("ru-RU")} ₽` : "Не указано",
          bank: app.selected_banks && app.selected_banks.length > 0 ? app.selected_banks[0].name : "Не выбран",
          status: app.status,
          statusLabel: statusLabels[app.status] || app.status,
          date: new Date(app.created_at).toLocaleDateString("ru-RU"),
          deadline: app.updated_at ? new Date(app.updated_at).toLocaleDateString("ru-RU") : "",
        }))
        setApplications(formatted)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.idDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск заявок..."
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
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="submitted">Отправлено</SelectItem>
                <SelectItem value="under_review">На рассмотрении</SelectItem>
                <SelectItem value="approved">Одобрено</SelectItem>
                <SelectItem value="rejected">Отклонено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      {filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-primary font-medium">{app.idDisplay}</p>
                    <CardTitle className="text-base text-foreground mt-1">{app.type}</CardTitle>
                  </div>
                  <Badge className={statusColors[app.status]}>{app.statusLabel}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Сумма:</span>
                    <span className="text-foreground font-medium">{app.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Банк:</span>
                    <span className="text-foreground">{app.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Дата подачи:</span>
                    <span className="text-foreground">{app.date}</span>
                  </div>
                </div>

                {app.deadline && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Обновлено: {app.deadline}</span>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full border-border text-foreground bg-transparent"
                  onClick={() => router.push(`/dashboard/client/applications/${app.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Заявки не найдены</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
