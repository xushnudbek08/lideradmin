"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { User, Save, Loader2 } from "lucide-react"

export default function PartnerProfilePage() {
  const { user, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.user.first_name || "",
        last_name: user.user.last_name || "",
        email: user.user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user, reset])

  const onSubmit = async (data: { first_name: string; last_name: string; email: string; phone: string }) => {
    setIsSubmitting(true)
    try {
      await authApi.updateProfile({
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        },
        phone: data.phone || null,
      })
      await refreshProfile()
      toast.success("Профиль успешно обновлен")
    } catch (error: any) {
      toast.error(error.message || "Ошибка при обновлении профиля")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Мой профиль</h1>
        <p className="text-muted-foreground mt-1">Управление личными данными и настройками аккаунта</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground">Личная информация</CardTitle>
              <CardDescription>Обновите свои личные данные</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-foreground">
                  Имя
                </Label>
                <Input
                  id="first_name"
                  {...register("first_name", { required: "Имя обязательно" })}
                  className="bg-background border-border text-foreground"
                  placeholder="Введите имя"
                />
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-foreground">
                  Фамилия
                </Label>
                <Input
                  id="last_name"
                  {...register("last_name", { required: "Фамилия обязательна" })}
                  className="bg-background border-border text-foreground"
                  placeholder="Введите фамилию"
                />
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email обязателен",
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

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Телефон
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className="bg-background border-border text-foreground"
                placeholder="+998901234567"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Имя пользователя</Label>
              <Input
                value={user.user.username}
                disabled
                className="bg-muted border-border text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Имя пользователя нельзя изменить</p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Роль</Label>
              <Input
                value={user.role === "partner" ? "Партнер" : user.role}
                disabled
                className="bg-muted border-border text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (user) {
                    reset({
                      first_name: user.user.first_name || "",
                      last_name: user.user.last_name || "",
                      email: user.user.email || "",
                      phone: user.phone || "",
                    })
                  }
                }}
                className="border-border text-foreground bg-transparent"
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить изменения
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

