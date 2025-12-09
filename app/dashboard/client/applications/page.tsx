"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Loader2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { applicationsApi } from "@/lib/api"
import { useRouter } from "next/navigation"
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

const productTabs = [
  { value: "all", label: "Все продукты" },
  { value: "tz", label: "ТЗ" },
  { value: "bank_guarantee", label: "БГ" },
  { value: "kik", label: "КИК" },
  { value: "revolving_credit", label: "ОБОРОТНЫЙ КРЕДИТ" },
  { value: "express_credit", label: "ЭКСПРЕСС-КРЕДИТ" },
  { value: "factoring", label: "ФАКТОРИНГ" },
  { value: "rko", label: "РКО" },
  { value: "special_account", label: "СПЕЦСЧЕТ" },
]

export default function ClientApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [productTab, setProductTab] = useState("all")
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
          idDisplay: String(app.id),
          type: app.product_type || "bank_guarantee",
          title: app.title || "",
          amount: app.amount ? parseFloat(app.amount) : null,
          fz: app.fz || "", // ФЗ (44-ФЗ, 223-ФЗ и т.д.)
          notice_number: app.notice_number || "", // № извещения
          contract_security: app.contract_security || null, // Обеспечение контракта
          status: app.status,
          statusLabel: statusLabels[app.status] || app.status,
          created_at: app.created_at,
          date: new Date(app.created_at).toLocaleDateString("ru-RU"),
          banks_count: app.selected_banks ? app.selected_banks.length : 0,
        }))
        setApplications(formatted)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast.error("Ошибка при загрузке заявок")
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.idDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.notice_number.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProduct = productTab === "all" || app.type === productTab
    return matchesSearch && matchesProduct
  })

  const formatCurrency = (value: number | null) => {
    if (!value) return "Не указано"
    return `${value.toLocaleString("ru-RU")} ₽`
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Мои заявки</h1>
          <p className="text-muted-foreground mt-1">Управление вашими заявками</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/client/create-application")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать заявку
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground h-9"
              />
            </div>
            <Button variant="outline" className="border-border text-foreground bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              ФИЛЬТР
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Tabs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Сводная таблица по созданным Вами заявкам:</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={productTab} onValueChange={setProductTab} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-2 bg-card border-border mb-6 h-auto p-1">
              {productTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs whitespace-nowrap"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={productTab} className="mt-0">
              <div className="space-y-4">
                {/* Summary */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Всего заявок по {productTab === "all" ? "всем продуктам" : productTabs.find((t) => t.value === productTab)?.label}: {filteredApplications.length}
                  </span>
                </div>

                {/* Table */}
                {filteredApplications.length > 0 ? (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-secondary border-b border-border">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">№ заявки</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Дата создания</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">ФЗ</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">№ извещения</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                              Обеспечение контракта, руб.
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Статус</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Заявок в банк</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredApplications.map((app) => (
                            <tr
                              key={app.id}
                              className="hover:bg-secondary/50 transition-colors cursor-pointer"
                              onClick={() => router.push(`/dashboard/client/applications/${app.id}`)}
                            >
                              <td className="px-4 py-3 text-sm text-foreground font-medium">{app.idDisplay}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{app.date}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{app.fz || "—"}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{app.notice_number || "—"}</td>
                              <td className="px-4 py-3 text-sm text-foreground">
                                {formatCurrency(app.contract_security)}
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={statusColors[app.status]}>{app.statusLabel}</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-foreground">{app.banks_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">Здесь будут доступны заявки после создания</p>
                      <Button
                        onClick={() => router.push("/dashboard/client/create-application")}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        СОЗДАТЬ ЗАЯВКУ ПО НОВОМУ АУКЦИОНУ
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
