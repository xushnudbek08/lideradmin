"use client"

import { useState, useEffect } from "react"
import { Loader2, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { applicationsApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Search } from "lucide-react"

const statusColors: Record<string, string> = {
  draft: "bg-gray-400/10 text-gray-500 border-gray-500/20",
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

export default function PartnerDashboardPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const response = await applicationsApi.list(100, 0)
        const applications = response?.results || (Array.isArray(response) ? response : [])
        setApplications(applications)
      } catch (error: any) {
        console.error("Error fetching applications:", error)
        // Don't show error toast for 401 - redirect will happen
        if (error.status !== 401) {
          toast.error(error.message || "Ошибка при загрузке заявок")
        }
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = applications.filter((app) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      (app.title?.toLowerCase().includes(searchLower) || false) ||
      (app.applicant?.first_name?.toLowerCase().includes(searchLower) || false) ||
      (app.applicant?.last_name?.toLowerCase().includes(searchLower) || false)

    if (activeTab === "all") return matchesSearch
    return matchesSearch && app.status === activeTab
  })

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "submitted" || a.status === "under_review").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "under_review":
        return <Clock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Кабинет партнёра</h1>
        <p className="text-muted-foreground mt-1">Управление заявками на финансирование</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">На рассмотрении</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Одобрено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Отклонено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Поиск по названию или клиенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Заявки на финансирование</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 bg-secondary h-auto flex-wrap gap-1">
              <TabsTrigger value="all" className="text-xs px-1 py-1">Все ({applications.length})</TabsTrigger>
              <TabsTrigger value="submitted" className="text-xs px-1 py-1">Отправлено ({applications.filter((a) => a.status === "submitted").length})</TabsTrigger>
              <TabsTrigger value="under_review" className="text-xs px-1 py-1">Рассмотрение ({applications.filter((a) => a.status === "under_review").length})</TabsTrigger>
              <TabsTrigger value="approved" className="text-xs px-1 py-1">Одобрено ({applications.filter((a) => a.status === "approved").length})</TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs px-1 py-1">Отклонено ({applications.filter((a) => a.status === "rejected").length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {filteredApplications.length > 0 ? (
                <div className="space-y-3">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/partner/applications/${app.id}`)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          {getStatusIcon(app.status)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{app.title || "Без названия"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {app.applicant?.first_name} {app.applicant?.last_name} • {new Date(app.created_at).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {app.amount && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Сумма</p>
                            <p className="font-medium text-foreground">{Number(app.amount).toLocaleString("ru-RU")} ₽</p>
                          </div>
                        )}

                        <Badge className={`${statusColors[app.status] || statusColors.draft} border`}>
                          {statusLabels[app.status] || app.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Заявок не найдено</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
