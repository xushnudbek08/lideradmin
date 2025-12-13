"use client"

import { useState, useEffect } from "react"
import { Trophy, Plus, Loader2, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { applicationsApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ClientWinsPage() {
  const [wins, setWins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchWins = async () => {
      try {
        setLoading(true)
        const data = await applicationsApi.getMyWins()
        
        // Check if data is valid
        if (!data || !Array.isArray(data)) {
          setWins([])
          return
        }
        
        const formatted = data.map((win: any) => ({
          id: win.id,
          protocol_date: win.protocol_date || win.created_at || new Date().toISOString(), // Выход протокола
          nmc: win.nmc || win.amount || null, // НМЦ, руб
          bg_amount: win.bg_amount || win.contract_security || null, // Сумма БГ, руб
          customer: win.customer || win.customer_name || "", // Заказчик
          subject: win.subject || win.title || "", // Предмет закупки
          notice_number: win.notice_number || "", // № извещения
        }))
        setWins(formatted)
      } catch (error: any) {
        console.error("Error fetching wins:", error)
        // Don't show error toast for 401 - redirect will happen
        if (error.status !== 401) {
          toast.error(error.message || "Ошибка при загрузке побед")
        }
        setWins([])
      } finally {
        setLoading(false)
      }
    }

    fetchWins()
  }, [])

  const filteredWins = wins.filter((win) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      win.customer.toLowerCase().includes(searchLower) ||
      win.subject.toLowerCase().includes(searchLower) ||
      win.notice_number.toLowerCase().includes(searchLower)
    )
  })

  const formatCurrency = (value: number | null | string) => {
    if (!value) return "—"
    const numValue = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(numValue)) return "—"
    return `${numValue.toLocaleString("ru-RU")} ₽`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    try {
      return new Date(dateString).toLocaleDateString("ru-RU")
    } catch {
      return "—"
    }
  }

  const handleCreateApplication = (win: any) => {
    // Переход на создание заявки с предзаполненными данными
    router.push(`/dashboard/client/create-application?win=${win.id}`)
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
          <h1 className="text-2xl font-bold text-foreground">Мои победы</h1>
          <p className="text-muted-foreground mt-1">Выигранные тендеры и закупки</p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Wins Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Выигранные тендеры ({filteredWins.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWins.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Выход протокола</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">НМЦ, руб</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Сумма БГ, руб</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Заказчик</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Предмет закупки</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredWins.map((win) => (
                      <tr key={win.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">{formatDate(win.protocol_date)}</td>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{formatCurrency(win.nmc)}</td>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{formatCurrency(win.bg_amount)}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{win.customer || "—"}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{win.subject || "—"}</td>
                        <td className="px-4 py-3">
                          <Button
                            onClick={() => handleCreateApplication(win)}
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Создать заявку
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Побед пока нет</p>
              <Button
                onClick={() => router.push("/dashboard/client/create-application")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать заявку
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
