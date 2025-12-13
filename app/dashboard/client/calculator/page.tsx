"use client"

import { useState, useEffect } from "react"
import { Calculator, Info, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { applicationsApi, banksApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

export default function ClientCalculatorPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [banks, setBanks] = useState<any[]>([])
  const [loadingBanks, setLoadingBanks] = useState(true)

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
    const fetchBanks = async () => {
      try {
        setLoadingBanks(true)
        const response = await banksApi.list(100, 0)
        setBanks(response.results)
      } catch (error) {
        console.error("Error fetching banks:", error)
        toast.error("Ошибка при загрузке банков")
      } finally {
        setLoadingBanks(false)
      }
    }
    fetchBanks()
  }, [])

  const handleBankToggle = (bankId: number) => {
    const current = selectedBanks || []
    if (current.includes(bankId)) {
      setValue("selected_banks", current.filter((id) => id !== bankId))
    } else {
      setValue("selected_banks", [...current, bankId])
    }
  }

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      await applicationsApi.create({
        title: data.title,
        company: user?.company || null,
        amount: data.amount || guaranteeAmount.toString(),
        selected_banks: data.selected_banks || [],
        notes: data.notes || "",
        status: "draft",
      })
      toast.success("Заявка создана успешно")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка создания заявки")
    } finally {
      setIsLoading(false)
    }
  }

  const [guaranteeAmount, setGuaranteeAmount] = useState(5000000)
  const [term, setTerm] = useState(12)
  const [rate] = useState(3)

  const commission = (guaranteeAmount * rate * term) / 100 / 12

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Calculator Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Создание заявки на гарантию</CardTitle>
                <CardDescription>Рассчитайте стоимость и создайте заявку</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Сумма гарантии</Label>
                <span className="text-sm text-primary font-medium">{formatCurrency(guaranteeAmount)}</span>
              </div>
              <Slider
                value={[guaranteeAmount]}
                onValueChange={([value]) => {
                  setGuaranteeAmount(value)
                  setValue("amount", value.toString())
                }}
                min={100000}
                max={100000000}
                step={100000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 000 ₽</span>
                <span>100 000 000 ₽</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Срок гарантии</Label>
                <span className="text-sm text-primary font-medium">{term} мес.</span>
              </div>
              <Slider value={[term]} onValueChange={([value]) => setTerm(value)} min={1} max={60} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 мес.</span>
                <span>60 мес.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Результаты расчёта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Стоимость гарантии</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(commission)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Сумма гарантии</p>
                  <p className="text-xl font-semibold text-foreground">{formatCurrency(guaranteeAmount)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Ставка</p>
                  <p className="text-xl font-semibold text-foreground">{rate}% годовых</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg">
              <Info className="w-4 h-4 text-accent mt-0.5" />
              <p className="text-sm text-accent">
                Точная стоимость зависит от условий банка и финансового состояния.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Form */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Заполните данные заявки</CardTitle>
          <CardDescription>Укажите дополнительную информацию для создания заявки</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Название заявки *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Название обязательно" })}
                  className="bg-background border-border text-foreground"
                  placeholder="Например: Банковская гарантия для тендера"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">Сумма гарантии (₽)</Label>
                <Input
                  id="amount"
                  type="number"
                  {...register("amount")}
                  className="bg-background border-border text-foreground"
                  placeholder="5000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Выберите банки</Label>
              {loadingBanks ? (
                <p className="text-sm text-muted-foreground">Загрузка банков...</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {banks.map((bank) => (
                    <div key={bank.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bank-${bank.id}`}
                        checked={selectedBanks?.includes(bank.id) || false}
                        onCheckedChange={() => handleBankToggle(bank.id)}
                      />
                      <Label htmlFor={`bank-${bank.id}`} className="text-sm text-foreground">
                        {bank.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground">Примечания</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                className="bg-background border-border text-foreground"
                placeholder="Дополнительная информация..."
                rows={3}
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
