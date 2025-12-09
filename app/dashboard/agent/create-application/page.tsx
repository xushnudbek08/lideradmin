"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { applicationsApi, banksApi, companiesApi } from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

export default function CreateApplicationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [banks, setBanks] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loadingBanks, setLoadingBanks] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      amount: "",
      selected_banks: [] as number[],
      notes: "",
    },
  })

  const selectedBanks = watch("selected_banks")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingBanks(true)
        const [banksResponse, companiesResponse] = await Promise.all([
          banksApi.list(100, 0),
          companiesApi.list(100, 0),
        ])
        setBanks(banksResponse.results)
        setCompanies(companiesResponse.results)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Ошибка при загрузке данных")
      } finally {
        setLoadingBanks(false)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: any) => {
    if (!selectedCompany) {
      toast.error("Пожалуйста, выберите компанию клиента")
      return
    }
    
    setIsLoading(true)
    try {
      await applicationsApi.create({
        title: data.title,
        company: selectedCompany,
        amount: data.amount || null,
        selected_banks: data.selected_banks || [],
        notes: data.notes || "",
        status: "draft",
      })
      toast.success("Заявка успешно создана")
      router.push("/dashboard/agent/applications")
    } catch (error: any) {
      toast.error(error.message || "Ошибка при создании заявки")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBank = (bankId: number) => {
    const current = selectedBanks || []
    if (current.includes(bankId)) {
      setValue("selected_banks", current.filter((id) => id !== bankId))
    } else {
      setValue("selected_banks", [...current, bankId])
    }
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
          <h1 className="text-2xl font-bold text-foreground">Создать заявку</h1>
          <p className="text-muted-foreground mt-1">Заполните данные для создания новой заявки</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Основная информация</CardTitle>
            <CardDescription>Укажите основные данные заявки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground">
                Компания клиента *
              </Label>
              <Select value={selectedCompany?.toString() || ""} onValueChange={(value) => setSelectedCompany(Number(value))}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Выберите компанию" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name} {company.inn ? `(ИНН: ${company.inn})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedCompany && <p className="text-sm text-destructive">Выберите компанию клиента</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Название заявки *
              </Label>
              <Input
                id="title"
                {...register("title", { required: "Название обязательно" })}
                className="bg-background border-border text-foreground"
                placeholder="Например: Банковская гарантия для тендера"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">
                Сумма (₽)
              </Label>
              <Input
                id="amount"
                type="number"
                {...register("amount")}
                className="bg-background border-border text-foreground"
                placeholder="5000000"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Выберите банки</Label>
              {loadingBanks ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-border rounded-lg bg-background">
                  {banks.map((bank) => (
                    <label
                      key={bank.id}
                      className="flex items-center gap-2 p-2 rounded border border-border cursor-pointer hover:bg-secondary transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBanks?.includes(bank.id) || false}
                        onChange={() => toggleBank(bank.id)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{bank.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">
                Примечания
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                className="bg-background border-border text-foreground"
                placeholder="Дополнительная информация..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-border text-foreground bg-transparent"
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Создать заявку
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

