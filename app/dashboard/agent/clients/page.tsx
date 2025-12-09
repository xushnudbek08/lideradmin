"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Building2, Phone, Mail, X, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { applicationsApi, companiesApi } from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

export default function AgentClientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inn: "",
      contact_name: "",
      company_name: "",
      email: "",
    },
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        // Get all companies - agent sees companies of their clients
        const companiesResponse = await companiesApi.list(100, 0)
        const companies = companiesResponse.results
        
        // Get client users to match with companies
        const clientUsers = await applicationsApi.getClients()
        
        // Create a map of user id to company
        const userCompanyMap = new Map()
        companies.forEach((company: any) => {
          if (company.created_by) {
            userCompanyMap.set(company.created_by, company)
          }
        })
        
        const clientsWithCompany = clientUsers.map((user: any) => {
          const company = userCompanyMap.get(user.id)
          return {
            id: user.id,
            name: company?.name || user.first_name + " " + user.last_name,
            email: user.email,
            company: company?.id || null,
            inn: company?.inn || "",
            contact: user.first_name + " " + user.last_name,
            phone: user.phone || "",
            applications: 0, // Would need to count from applications
            status: "Активный",
          }
        })
        
        setClients(clientsWithCompany)
      } catch (error) {
        console.error("Error fetching clients:", error)
        toast.error("Ошибка при загрузке клиентов")
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const onSubmit = async (data: { inn: string; contact_name: string; company_name: string; email: string }) => {
    setIsSaving(true)
    try {
      // Create company first
      const company = await companiesApi.create({
        name: data.company_name,
        inn: data.inn || null,
        address: "",
        requisites: null,
      })
      toast.success("Клиент успешно добавлен")
      setShowAddForm(false)
      reset()
      // Refresh clients list
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || "Ошибка при добавлении клиента")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.inn?.includes(searchQuery) ||
      client.contact?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Поиск по названию, ИНН или контакту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground h-9"
              />
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить клиента
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Client Form */}
      {showAddForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Добавление нового клиента</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddForm(false)
                  reset()
                }}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">(* поля, обязательные для заполнения)</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inn" className="text-foreground">
                  ИНН *
                </Label>
                <Input
                  id="inn"
                  {...register("inn", { required: "ИНН обязательно" })}
                  className="bg-background border-border text-foreground"
                  placeholder="1234567890"
                />
                {errors.inn && <p className="text-sm text-destructive">{errors.inn.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_name" className="text-foreground">
                  ФИО контактного лица *
                </Label>
                <Input
                  id="contact_name"
                  {...register("contact_name", { required: "ФИО обязательно" })}
                  className="bg-background border-border text-foreground"
                  placeholder="Иванов Иван Иванович"
                />
                {errors.contact_name && <p className="text-sm text-destructive">{errors.contact_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-foreground">
                  Наименование компании *
                </Label>
                <Input
                  id="company_name"
                  {...register("company_name", { required: "Название компании обязательно" })}
                  className="bg-background border-border text-foreground"
                  placeholder="ООО Пример"
                />
                {errors.company_name && <p className="text-sm text-destructive">{errors.company_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email обязательно",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Неверный формат email",
                    },
                  })}
                  className="bg-background border-border text-foreground"
                  placeholder="example@mail.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    reset()
                  }}
                  className="border-border text-foreground bg-transparent"
                  disabled={isSaving}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Добавление...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Добавить клиента
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Clients List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Мои клиенты ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Наименование</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Контакты</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">ИНН</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Регион</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-4">
                        <button
                          onClick={() => {
                            if (client.company) {
                              router.push(`/dashboard/agent/clients/${client.company}`)
                            }
                          }}
                          className="text-sm text-primary font-medium hover:underline text-left"
                        >
                          {client.name || "Не указано"}
                        </button>
                      </td>
                      <td className="py-4 text-sm text-foreground">
                        <div>{client.contact || "—"}</div>
                        {client.email && (
                          <div className="text-muted-foreground text-xs mt-1">{client.email}</div>
                        )}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{client.inn || "—"}</td>
                      <td className="py-4 text-sm text-muted-foreground">—</td>
                      <td className="py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (client.company) {
                              router.push(`/dashboard/agent/clients/${client.company}`)
                            }
                          }}
                          className="border-border text-foreground bg-transparent"
                        >
                          Открыть
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Нет клиентов
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
