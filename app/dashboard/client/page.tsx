"use client"

import { useEffect, useState } from "react"
import { Award, FileText, Building2, Trophy, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { applicationsApi } from "@/lib/api"
import { useRouter } from "next/navigation"

const accreditationSteps = [
  { id: 1, title: "Регистрация", status: "completed" },
  { id: 2, title: "Документы", status: "completed" },
  { id: 3, title: "Проверка", status: "current" },
  { id: 4, title: "Аккредитация", status: "pending" },
]

export default function ClientDashboardPage() {
  const [stats, setStats] = useState({
    active: 0,
    approved: 0,
    pending: 0,
    wins: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [applications, wins] = await Promise.all([
          applicationsApi.getMyApplications(),
          applicationsApi.getMyWins(),
        ])

        const active = applications.filter((app) => app.status === "submitted" || app.status === "under_review").length
        const approved = applications.filter((app) => app.status === "approved").length
        const pending = applications.filter((app) => app.status === "under_review").length

        setStats({
          active,
          approved,
          pending,
          wins: wins.length,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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
        <StatsCard title="Активных заявок" value={stats.active} icon={FileText} />
        <StatsCard title="Одобрено" value={stats.approved} icon={CheckCircle2} />
        <StatsCard title="На рассмотрении" value={stats.pending} icon={Clock} />
        <StatsCard title="Побед в тендерах" value={stats.wins} icon={Trophy} />
      </div>

      {/* Accreditation Status */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Статус аккредитации</CardTitle>
              <CardDescription>Отслеживайте процесс аккредитации вашей компании</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="text-primary font-medium">50%</span>
          </div>
          <Progress value={50} className="h-2" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accreditationSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-xl border ${
                  step.status === "completed"
                    ? "bg-green-500/10 border-green-500/20"
                    : step.status === "current"
                      ? "bg-primary/10 border-primary/20"
                      : "bg-secondary border-border"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : step.status === "current" ? (
                    <Clock className="w-5 h-5 text-primary" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">{step.title}</span>
                </div>
                <Badge
                  className={
                    step.status === "completed"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : step.status === "current"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-secondary text-muted-foreground border-border"
                  }
                >
                  {step.status === "completed" ? "Завершено" : step.status === "current" ? "В процессе" : "Ожидает"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Info and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Моя компания</CardTitle>
                <CardDescription>Информация о вашей организации</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Название</span>
              <span className="text-foreground text-sm font-medium">ООО "ТехноСервис"</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">ИНН</span>
              <span className="text-foreground text-sm font-medium">7712345678</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">ОГРН</span>
              <span className="text-foreground text-sm font-medium">1027700123456</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Руководитель</span>
              <span className="text-foreground text-sm font-medium">Иванов И.И.</span>
            </div>
            <Button variant="outline" className="w-full border-border text-foreground bg-transparent">
              Редактировать
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/dashboard/client/applications")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Создать новую заявку
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent"
            >
              <Award className="w-4 h-4 mr-2" />
              Загрузить документы
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-secondary bg-transparent"
              onClick={() => router.push("/dashboard/client/wins")}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Посмотреть тендеры
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
