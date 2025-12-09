"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Building2, Phone, Mail, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { companiesApi } from "@/lib/api"
import { toast } from "sonner"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = Number(params.id)
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        const data = await companiesApi.get(companyId)
        setCompany(data)
      } catch (error) {
        console.error("Error fetching company:", error)
        toast.error("Ошибка при загрузке данных компании")
        router.back()
      } finally {
        setLoading(false)
      }
    }

    if (companyId) {
      fetchCompany()
    }
  }, [companyId, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Компания не найдена</p>
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
          <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
          <p className="text-muted-foreground mt-1">Информация о компании</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-foreground">{company.name}</CardTitle>
              <CardDescription>Детальная информация о компании</CardDescription>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Активна</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">ИНН</span>
              <span className="text-foreground text-sm font-medium">{company.inn || "Не указан"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Адрес</span>
              <span className="text-foreground text-sm font-medium">{company.address || "Не указан"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Дата создания</span>
              <span className="text-foreground text-sm font-medium">
                {new Date(company.created_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Статус</span>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Активна</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

