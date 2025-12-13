"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalculatorWidget } from "@/components/dashboard/calculator-widget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { applicationsApi, banksApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

export default function ClientCalculatorPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [banks, setBanks] = useState<any[]>([])
  const [loadingBanks, setLoadingBanks] = useState(true)
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null)
  const [calculatedTerm, setCalculatedTerm] = useState<number | null>(null)

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

  // Load banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoadingBanks(true)
        const response = await banksApi.list(100, 0)
        if (response && response.results) {
          setBanks(response.results)
        } else if (Array.isArray(response)) {
          setBanks(response)
        } else {
          setBanks([])
        }
      } catch (error: any) {
        console.error("Error fetching banks:", error)
        toast.error(error.message || "Ошибка при загрузке банков")
        setBanks([])
      } finally {
        setLoadingBanks(false)
      }
    }
    fetchBanks()
  }, [])

  const handleCalculate = (amount: number, term: number) => {
    setCalculatedAmount(amount)
    setCalculatedTerm(term)
    setValue("amount", amount.toString())
    toast.success("Значения применены к заявке")
  }

  const toggleBank = (bankId: number) => {
    const current = selectedBanks || []
    if (current.includes(bankId)) {
      setValue("selected_banks", current.filter((id) => id !== bankId))
    } else {
      setValue("selected_banks", [...current, bankId])
    }
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await applicationsApi.create({
        title: data.title,
        company: user?.company || null,
        amount: data.amount || null,
        selected_banks: data.selected_banks || [],
        notes: data.notes || "",
        status: "draft",
      })
      toast.success("Заявка успешно создана")
      router.push("/dashboard/client/applications")
    } catch (error: any) {
      toast.error(error.message || "Ошибка при создании заявки")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Создать заявку</h1>
        <p className="text-muted-foreground mt-1">Рассчитайте параметры и заполните данные для создания заявки</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Widget - Left Side */}
        <div className="lg:col-span-1">
          <CalculatorWidget onCalculate={handleCalculate} role="client" />
        </div>

        {/* Application Form - Right Side */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Данные заявки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
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
                    readOnly={!!calculatedAmount}
                  />
                  {calculatedAmount && (
                    <p className="text-xs text-muted-foreground">Значение применено из калькулятора</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Выберите банки</Label>
                  {loadingBanks ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : banks.length === 0 ? (
                    <div className="p-6 text-center border border-border rounded-lg bg-background">
                      <p className="text-sm text-muted-foreground">Банки не найдены</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-border rounded-lg bg-background max-h-48 overflow-y-auto">
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
                          <span className="text-xs text-foreground">{bank.name}</span>
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
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
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
                      "Создать заявку"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
