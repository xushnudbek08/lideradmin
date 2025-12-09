"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calculator, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function ClientCalculatorPage() {
  const router = useRouter()
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Калькулятор гарантии</CardTitle>
                <CardDescription>Рассчитайте стоимость банковской гарантии</CardDescription>
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
                onValueChange={([value]) => setGuaranteeAmount(value)}
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

            <Button 
              onClick={() => router.push('/dashboard/client/create-application')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Подать заявку на гарантию
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
