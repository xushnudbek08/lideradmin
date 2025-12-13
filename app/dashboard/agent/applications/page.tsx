"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { applicationsApi, companiesApi } from "@/lib/api"
import { toast } from "sonner"

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

const productTabs = [
  { value: "all", label: "Все продукты" },
  { value: "bank_guarantee", label: "БГ" },
  { value: "tz", label: "ТЗ" },
  { value: "kik", label: "КИК" },
  { value: "revolving_credit", label: "ОБОРОТНЫЙ КРЕДИТ" },
  { value: "express_credit", label: "ЭКСПРЕСС-КРЕДИТ" },
  { value: "factoring", label: "ФАКТОРИНГ" },
  { value: "rko", label: "РКО" },
  { value: "special_account", label: "СПЕЦСЧЕТ" },
]

export default function AgentApplicationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [productTab, setProductTab] = useState("all")
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true)
        const data = await applicationsApi.getMyApplications()
        
        // Check if data is valid
        if (!data || !Array.isArray(data)) {
          setApplications([])
          return
        }
        
        // Fetch company info for applications that have company
        const applicationsWithCompany = await Promise.all(
          data.map(async (app: any) => {
            if (app && app.company) {
              try {
                const company = await companiesApi.get(app.company)
                return { ...app, companyData: company }
              } catch {
                return { ...app, companyData: null }
              }
            }
            return { ...app, companyData: null }
          }),
        )
        setApplications(applicationsWithCompany)
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

  const filteredApplications = applications
    .filter((app) => {
    const matchesSearch =
        app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `ZAY-${String(app.id).padStart(3, "0")}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesProduct = productTab === "all" || app.type === productTab

    return matchesSearch && matchesStatus && matchesProduct
  })
    .map((app) => ({
      id: app.id,
      idDisplay: `ZAY-${String(app.id).padStart(3, "0")}`,
      company: app.applicant ? `${app.applicant.first_name} ${app.applicant.last_name}` : "Не указано",
      companyId: app.company || null,
      inn: app.companyData?.inn || "",
      type: app.company ? "Юр. Лицо" : "ИП", // Simplified
      amount: app.amount ? `${parseFloat(app.amount).toLocaleString("ru-RU")} ₽` : "Не указано",
      bank: app.selected_banks && app.selected_banks.length > 0 
        ? (typeof app.selected_banks[0] === 'object' 
            ? app.selected_banks[0].name 
            : "Банк выбран") 
        : "Не выбран",
      status: app.status,
      statusLabel: statusLabels[app.status] || app.status,
      date: new Date(app.created_at).toLocaleDateString("ru-RU"),
    }))

  const handleApplicationClick = (id: number) => {
    router.push(`/dashboard/agent/applications/${id}`)
  }

  const handleCompanyClick = (companyId: number | null, companyName: string) => {
    if (companyId) {
      router.push(`/dashboard/agent/clients/${companyId}`)
    } else {
      toast.error("Компания не найдена")
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
      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Поиск по номеру, компании или ИНН..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground h-9"
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

      {/* Product Tabs */}
      <Tabs value={productTab} onValueChange={setProductTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 gap-1 bg-card border-border mb-6 h-auto p-1 flex-wrap">
          {productTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs px-1 py-1 whitespace-nowrap"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={productTab} className="mt-6">
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Всего заявок по {productTab === "all" ? "всем продуктам" : productTabs.find((t) => t.value === productTab)?.label}: {filteredApplications.length}
              </span>
            </div>

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
                </tr>
              </thead>
              <tbody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((app) => {
                        const statusKey = app.status
                        return (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                            <td className="py-4">
                              <button
                                onClick={() => handleApplicationClick(app.id)}
                                className="text-sm text-primary font-medium hover:underline"
                              >
                                {app.idDisplay}
                              </button>
                            </td>
                            <td className="py-4">
                              {app.companyId ? (
                                <button
                                  onClick={() => handleCompanyClick(app.companyId, app.company)}
                                  className="text-sm text-primary hover:underline text-left"
                                >
                                  {app.company}
                                </button>
                              ) : (
                                <span className="text-sm text-foreground">{app.company}</span>
                              )}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">{app.inn || "—"}</td>
                    <td className="py-4 text-sm text-foreground">{app.type}</td>
                    <td className="py-4 text-sm text-foreground font-medium">{app.amount}</td>
                    <td className="py-4 text-sm text-foreground">{app.bank}</td>
                    <td className="py-4">
                              <Badge className={statusColors[statusKey]}>{app.statusLabel}</Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{app.date}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
