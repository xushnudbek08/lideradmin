"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Building2, FileText, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { applicationsApi } from "@/lib/api"
import { toast } from "sonner"

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

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = Number(params.id)
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        const data = await applicationsApi.get(applicationId)
        setApplication(data)
      } catch (error) {
        console.error("Error fetching application:", error)
        toast.error("Ошибка при загрузке заявки")
        router.back()
      } finally {
        setLoading(false)
      }
    }

    if (applicationId) {
      fetchApplication()
    }
  }, [applicationId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Заявка не найдена</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="border-border text-foreground bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Заявка № {`ZAY-${String(application.id).padStart(3, "0")}`}
          </h1>
          <p className="text-muted-foreground mt-1">Детальная информация о заявке</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">{application.title || "Без названия"}</CardTitle>
                <Badge className={statusColors[application.status]}>{statusLabels[application.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Сумма</p>
                  <p className="text-lg font-semibold text-foreground">
                    {application.amount ? `${parseFloat(application.amount).toLocaleString("ru-RU")} ₽` : "Не указано"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Дата создания</p>
                  <p className="text-foreground">
                    {new Date(application.created_at).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {application.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Примечания</p>
                  <p className="text-foreground">{application.notes}</p>
                </div>
              )}

              {application.selected_banks && application.selected_banks.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Выбранные банки</p>
                  <div className="flex flex-wrap gap-2">
                    {application.selected_banks.map((bank: any) => (
                      <Badge key={bank.id} variant="outline" className="border-border text-foreground">
                        {bank.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Информация о заявителе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">ФИО</p>
                <p className="text-foreground font-medium">
                  {application.applicant?.first_name} {application.applicant?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{application.applicant?.email || "Не указан"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

