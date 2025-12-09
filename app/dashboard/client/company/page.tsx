"use client"

import { useEffect, useState } from "react"
import { Building2, Edit, Loader2, Save, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { companiesApi } from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

export default function ClientCompanyPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      inn: "",
      address: "",
    },
  })

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        if (user?.company) {
          const companyData = await companiesApi.get(user.company)
          setCompany(companyData)
          reset({
            name: companyData.name || "",
            inn: companyData.inn || "",
            address: companyData.address || "",
          })
        }
      } catch (error: any) {
        console.error("Error fetching company:", error)
        toast.error("Ошибка при загрузке данных компании")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCompany()
    }
  }, [user, reset])

  const onSubmit = async (data: { name: string; inn: string; address: string }) => {
    if (!user?.company) {
      toast.error("Компания не найдена")
      return
    }

    setIsSaving(true)
    try {
      const updated = await companiesApi.update?.(user.company, {
        name: data.name,
        inn: data.inn || null,
        address: data.address,
      })
      if (updated) {
        setCompany(updated)
        setIsEditing(false)
        toast.success("Компания успешно обновлена")
      } else {
        // Agar update metodi yo'q bo'lsa, create qilish yoki xato xabari
        toast.error("Обновление компании временно недоступно")
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка при обновлении компании")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user?.company) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Компания не найдена</h3>
            <p className="text-muted-foreground mb-4">У вас нет привязанной компании</p>
            <Button
              onClick={async () => {
                try {
                  const newCompany = await companiesApi.create({
                    name: "",
                    inn: null,
                    address: "",
                    requisites: null,
                  })
                  toast.success("Компания создана")
                  window.location.reload()
                } catch (error: any) {
                  toast.error(error.message || "Ошибка при создании компании")
                }
              }}
              className="bg-primary text-primary-foreground"
            >
              Создать компанию
            </Button>
          </CardContent>
        </Card>
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Моя компания</h1>
        <p className="text-muted-foreground mt-1">Информация о вашей компании</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Информация о компании</CardTitle>
                <CardDescription>Управление данными вашей организации</CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="border-border text-foreground bg-transparent"
              >
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Название компании *
                </Label>
                <Input
                  id="name"
                  {...register("name", { required: "Название обязательно" })}
                  className="bg-background border-border text-foreground"
                  placeholder="ООО Пример"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inn" className="text-foreground">
                  ИНН
                </Label>
                <Input
                  id="inn"
                  {...register("inn")}
                  className="bg-background border-border text-foreground"
                  placeholder="1234567890"
                />
                {errors.inn && <p className="text-sm text-destructive">{errors.inn.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground">
                  Адрес *
                </Label>
                <Input
                  id="address"
                  {...register("address", { required: "Адрес обязателен" })}
                  className="bg-background border-border text-foreground"
                  placeholder="г. Москва, ул. Примерная, д. 1"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Дата создания</Label>
                <Input
                  value={new Date(company.created_at).toLocaleDateString("ru-RU")}
                  disabled
                  className="bg-muted border-border text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    reset({
                      name: company.name || "",
                      inn: company.inn || "",
                      address: company.address || "",
                    })
                  }}
                  className="border-border text-foreground bg-transparent"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground text-sm">Название</span>
                <span className="text-foreground text-sm font-medium">{company.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground text-sm">ИНН</span>
                <span className="text-foreground text-sm font-medium">{company.inn || "Не указан"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground text-sm">Адрес</span>
                <span className="text-foreground text-sm font-medium">{company.address}</span>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}



