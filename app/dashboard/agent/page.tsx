"use client"

import { useEffect, useState } from "react"
import { Building2, FileText, Users, TrendingUp, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { applicationsApi } from "@/lib/api"

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  submitted: "bg-primary/10 text-primary border-primary/20",
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

export default function AgentDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    clients: 0,
    approved: 0,
    totalAmount: 0,
  })
  const [recentApplications, setRecentApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [applications, clients] = await Promise.all([
          applicationsApi.getMyApplications().catch(() => []),
          applicationsApi.getClients().catch(() => []),
        ])

        const apps = Array.isArray(applications) ? applications : []
        const clientList = Array.isArray(clients) ? clients : []

        const approved = apps.filter((app: any) => app && app.status === "approved").length
        const totalAmount = apps
          .filter((app: any) => app && app.status === "approved" && app.amount)
          .reduce((sum: number, app: any) => sum + parseFloat(app.amount || "0"), 0)

        const recent = apps
          .filter((app: any) => app && app.created_at)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4)
          .map((app: any) => ({
            id: `ZAY-${String(app.id).padStart(3, "0")}`,
            company: app.applicant ? `${app.applicant.first_name || ""} ${app.applicant.last_name || ""}`.trim() : "Не указано",
            amount: app.amount ? `${parseFloat(app.amount).toLocaleString("ru-RU")} ₽` : "Не указано",
            status: statusLabels[app.status] || app.status || "Не указано",
            date: app.created_at ? new Date(app.created_at).toLocaleDateString("ru-RU") : new Date().toLocaleDateString("ru-RU"),
          }))

        setStats({
          total: apps.length,
          clients: clientList.length,
          approved,
          totalAmount,
        })
        setRecentApplications(recent)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        // Don't show error toast for 401 - redirect will happen
        if (error.status !== 401) {
          console.error("Error details:", error)
        }
        setStats({ total: 0, clients: 0, approved: 0, totalAmount: 0 })
        setRecentApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Всего заявок" value={stats.total} icon={FileText} />
        <StatsCard title="Активные клиенты" value={stats.clients} icon={Users} />
        <StatsCard title="Одобрено" value={stats.approved} icon={CheckCircle2} />
        <StatsCard
          title="Общая сумма"
          value={stats.totalAmount >= 1000000 ? `${(stats.totalAmount / 1000000).toFixed(1)}M ₽` : `${stats.totalAmount.toLocaleString("ru-RU")} ₽`}
          icon={TrendingUp}
        />
      </div>

      {/* Company Info and Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">ООО "Финансовый Партнёр"</CardTitle>
                <CardDescription>ИНН: 7712345678</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Статус аккредитации</span>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Активна</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Договор до</span>
              <span className="text-foreground text-sm font-medium">31.12.2025</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Комиссия</span>
              <span className="text-foreground text-sm font-medium">2.5%</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Последние заявки</CardTitle>
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">№ Заявки</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Компания</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Сумма</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Статус</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.length > 0 ? (
                    recentApplications.map((app) => {
                      const statusKey = Object.keys(statusLabels).find(
                        (key) => statusLabels[key] === app.status,
                      ) || "draft"
                      return (
                    <tr key={app.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm text-primary font-medium">{app.id}</td>
                      <td className="py-3 text-sm text-foreground">{app.company}</td>
                      <td className="py-3 text-sm text-foreground">{app.amount}</td>
                      <td className="py-3">
                            <Badge className={statusColors[statusKey]}>{app.status}</Badge>
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">{app.date}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        Нет заявок
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
