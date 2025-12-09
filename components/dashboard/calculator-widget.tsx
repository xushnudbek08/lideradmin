"use client"

import { useState } from "react"
import { Calculator, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CalculatorWidgetProps {
  onCalculate?: (amount: number, term: number) => void
  role?: "client" | "agent"
}

export function CalculatorWidget({ onCalculate, role = "client" }: CalculatorWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [guaranteeAmount, setGuaranteeAmount] = useState(1000000)
  const [term, setTerm] = useState(36)
  const [purchaseType, setPurchaseType] = useState("44-fz")
  const [guaranteeType, setGuaranteeType] = useState("execution")

  // Расчет ставки в зависимости от типа закупки и типа гарантии
  const getRate = () => {
    // Базовые ставки (примерные значения)
    const rates: Record<string, Record<string, number>> = {
      "44-fz": {
        execution: 4.17,
        advance: 4.17,
        participation: 4.17,
      },
      "223-fz": {
        execution: 4.5,
        advance: 4.5,
        participation: 4.5,
      },
      "185-fz": {
        execution: 4.0,
        advance: 4.0,
        participation: 4.0,
      },
    }
    return rates[purchaseType]?.[guaranteeType] || 4.17
  }

  const rate = getRate()
  const commission = (guaranteeAmount * rate * term) / 100 / 12

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("ru-RU").format(value)
  }

  const handleApply = () => {
    if (onCalculate) {
      onCalculate(guaranteeAmount, term)
    }
  }

  // Agent calculator (credit calculator)
  const [creditRate, setCreditRate] = useState(15)
  const monthlyRate = creditRate / 100 / 12
  const monthlyPayment = (guaranteeAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
  const totalPayment = monthlyPayment * term
  const overpayment = totalPayment - guaranteeAmount

  if (role === "client") {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-border text-foreground bg-transparent hover:bg-secondary"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Калькулятор гарантии</span>
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Сумма (руб.)</Label>
                    <div className="text-2xl font-bold text-foreground">{formatNumber(guaranteeAmount)}</div>
                    <Slider
                      value={[guaranteeAmount]}
                      onValueChange={([value]) => setGuaranteeAmount(value)}
                      min={100000}
                      max={100000000}
                      step={100000}
                      className="mt-2"
                    />
                  </div>

                  {/* Purchase Type */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Тип закупки</Label>
                    <RadioGroup value={purchaseType} onValueChange={setPurchaseType} className="flex gap-2">
                      <div key="44-fz" className="flex-1">
                        <RadioGroupItem value="44-fz" id="calc-44-fz" className="peer sr-only" />
                        <Label
                          htmlFor="calc-44-fz"
                          className="flex items-center justify-center px-3 py-2 border border-border rounded-md cursor-pointer text-xs font-medium text-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive peer-data-[state=checked]:bg-destructive/10 hover:bg-secondary transition-colors"
                        >
                          44-ФЗ
                        </Label>
                      </div>
                      <div key="223-fz" className="flex-1">
                        <RadioGroupItem value="223-fz" id="calc-223-fz" className="peer sr-only" />
                        <Label
                          htmlFor="calc-223-fz"
                          className="flex items-center justify-center px-3 py-2 border border-border rounded-md cursor-pointer text-xs font-medium text-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive peer-data-[state=checked]:bg-destructive/10 hover:bg-secondary transition-colors"
                        >
                          223-ФЗ
                        </Label>
                      </div>
                      <div key="185-fz" className="flex-1">
                        <RadioGroupItem value="185-fz" id="calc-185-fz" className="peer sr-only" />
                        <Label
                          htmlFor="calc-185-fz"
                          className="flex items-center justify-center px-3 py-2 border border-border rounded-md cursor-pointer text-xs font-medium text-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive peer-data-[state=checked]:bg-destructive/10 hover:bg-secondary transition-colors"
                        >
                          185-ФЗ/615-ПП
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Guarantee Type */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Тип гарантии</Label>
                    <RadioGroup value={guaranteeType} onValueChange={setGuaranteeType} className="flex gap-2">
                      <div key="execution" className="flex-1">
                        <RadioGroupItem value="execution" id="calc-execution" className="peer sr-only" />
                        <Label
                          htmlFor="calc-execution"
                          className="flex items-center justify-center px-2 py-2 border border-border rounded-md cursor-pointer text-xs font-medium text-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive peer-data-[state=checked]:bg-destructive/10 hover:bg-secondary transition-colors"
                        >
                          ИСПОЛНЕНИЕ
                        </Label>
                      </div>
                      <div key="advance" className="flex-1">
                        <RadioGroupItem value="advance" id="calc-advance" className="peer sr-only" />
                        <Label
                          htmlFor="calc-advance"
                          className="flex items-center justify-center px-2 py-2 border border-border rounded-md cursor-pointer text-xs font-medium text-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive peer-data-[state=checked]:bg-destructive/10 hover:bg-secondary transition-colors"
                        >
                          АВАНС
                        </Label>
                      </div>
                      <div key="participation" className="flex-1">
                        <RadioGroupItem value="participation" id="calc-participation" className="peer sr-only" />
                        <Label
                          htmlFor="calc-participation"
                          className="flex items-center justify-center px-2 py-2 border border-border rounded-md cursor-pointer text-xs font-medium text-foreground peer-data-[state=checked]:border-destructive peer-data-[state=checked]:text-destructive peer-data-[state=checked]:bg-destructive/10 hover:bg-secondary transition-colors"
                        >
                          УЧАСТИЕ
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Commission Amount */}
                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground uppercase">Сумма комиссии</Label>
                    <div className="text-xl font-bold text-destructive mt-1">{formatCurrency(commission)}</div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Term */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Срок (месяц)</Label>
                    <div className="text-2xl font-bold text-foreground">{term}</div>
                    <Slider
                      value={[term]}
                      onValueChange={([value]) => setTerm(value)}
                      min={1}
                      max={60}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Rate */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Ставка (%)</Label>
                    <div className="text-2xl font-bold text-foreground">{rate.toFixed(2)}</div>
                  </div>

                  {/* Guarantee Obligations */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Гарантийные обязательства</Label>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  * Приведенный расчет комиссии предварительный, Вы всегда можете запросить скидку у Вашего менеджера
                </p>
              </div>

              <Button
                onClick={handleApply}
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                Применить к заявке
              </Button>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-border text-foreground bg-transparent hover:bg-secondary"
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <span>Кредитный калькулятор</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground">Рассчитайте параметры финансирования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Сумма кредита</Label>
                <span className="text-sm text-primary font-medium">{formatCurrency(guaranteeAmount)}</span>
              </div>
              <Slider
                value={[guaranteeAmount]}
                onValueChange={([value]) => setGuaranteeAmount(value)}
                min={100000}
                max={50000000}
                step={100000}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 000 ₽</span>
                <span>50 000 000 ₽</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Срок кредита</Label>
                <span className="text-sm text-primary font-medium">{term} мес.</span>
              </div>
              <Slider value={[term]} onValueChange={([value]) => setTerm(value)} min={6} max={84} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6 мес.</span>
                <span>84 мес.</span>
              </div>
            </div>

            {/* Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Процентная ставка</Label>
                <span className="text-sm text-primary font-medium">{creditRate}%</span>
              </div>
              <Slider value={[creditRate]} onValueChange={([value]) => setCreditRate(value)} min={5} max={30} step={0.5} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Ежемесячный платёж</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Переплата</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(overpayment)}</p>
                </div>
                <div className="p-2 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Общая сумма</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(totalPayment)}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleApply}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              Применить к заявке
            </Button>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

