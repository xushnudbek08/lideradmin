"use client"

import { useState } from "react"
import { Calculator, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function AgentCalculatorPage() {
  const [amount, setAmount] = useState(5000000)
  const [term, setTerm] = useState(12)
  const [rate, setRate] = useState(15)
  const [type, setType] = useState("annuity")

  const monthlyRate = rate / 100 / 12
  const monthlyPayment =
    type === "annuity"
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
      : amount / term + amount * monthlyRate

  const totalPayment = monthlyPayment * term
  const overpayment = totalPayment - amount

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Кредитный калькулятор</CardTitle>
                <CardDescription>Рассчитайте параметры финансирования</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Сумма кредита</Label>
                <span className="text-sm text-primary font-medium">{formatCurrency(amount)}</span>
              </div>
              <Slider
                value={[amount]}
                onValueChange={([value]) => setAmount(value)}
                min={100000}
                max={50000000}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 000 ₽</span>
                <span>50 000 000 ₽</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Срок кредита</Label>
                <span className="text-sm text-primary font-medium">{term} мес.</span>
              </div>
              <Slider value={[term]} onValueChange={([value]) => setTerm(value)} min={6} max={84} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6 мес.</span>
                <span>84 мес.</span>
              </div>
            </div>

            {/* Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Процентная ставка</Label>
                <span className="text-sm text-primary font-medium">{rate}%</span>
              </div>
              <Slider value={[rate]} onValueChange={([value]) => setRate(value)} min={5} max={30} step={0.5} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label className="text-foreground">Тип платежа</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="annuity">Аннуитетный</SelectItem>
                  <SelectItem value="differential">Дифференцированный</SelectItem>
                </SelectContent>
              </Select>
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
                <p className="text-sm text-muted-foreground mb-1">Ежемесячный платёж</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(monthlyPayment)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Сумма кредита</p>
                  <p className="text-xl font-semibold text-foreground">{formatCurrency(amount)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Переплата</p>
                  <p className="text-xl font-semibold text-accent">{formatCurrency(overpayment)}</p>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Общая сумма выплат</p>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(totalPayment)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-500">
                Расчёт носит информационный характер. Точные условия уточняйте в банке.
              </p>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Создать заявку с этими параметрами
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
