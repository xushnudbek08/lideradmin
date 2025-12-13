"use client"

import { useState } from "react"
import { Award, FileText, Info, CheckCircle2, ArrowRight, ArrowLeft, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

export default function ClientAccreditationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedECP, setSelectedECP] = useState<string>("")
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: user?.company?.name || "",
      inn: user?.company?.inn || "",
      ogrn: "",
      kpp: "",
      address: user?.company?.address || "",
      director_name: "",
      director_position: "",
      contact_person: "",
      contact_phone: "",
      contact_email: user?.email || "",
      bank_name: "",
      bank_account: "",
      bank_bik: "",
      bank_ks: "",
      notes: "",
    },
  })

  const ecpOptions = [
    { value: "crypto-pro", label: "КриптоПро CSP", description: "Российское решение для электронной подписи" },
    { value: "crypto-arm", label: "КриптоАРМ", description: "Программное обеспечение для работы с ЭЦП" },
    { value: "other", label: "Другое", description: "Укажите в примечаниях" },
  ]

  const handleECPSelect = (value: string) => {
    setSelectedECP(value)
    if (value) {
      setTimeout(() => setCurrentStep(2), 500)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // Здесь будет отправка данных на сервер
      toast.success("Заявка на аккредитацию успешно подана")
      // Можно добавить редирект или обновление состояния
    } catch (error: any) {
      toast.error(error.message || "Ошибка при подаче заявки")
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Подача на аккредитацию</h1>
        <p className="text-muted-foreground mt-1">Заполните форму для подачи заявки на аккредитацию</p>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-blue-500 text-lg">Инструкция</CardTitle>
              <CardDescription className="text-blue-500/80 mt-2">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Выберите тип электронной цифровой подписи (ЭЦП), который вы будете использовать</li>
                  <li>Заполните все обязательные поля формы с данными вашей компании</li>
                  <li>Проверьте правильность введенных данных перед отправкой</li>
                  <li>После подачи заявки ожидайте рассмотрения. Статус будет отображаться в личном кабинете</li>
                </ol>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Steps */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-muted-foreground"
                }`}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
              </div>
              <span className="font-medium">Выбор ЭЦП</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="font-medium">Заполнение формы</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-foreground mb-4 block">
                  Выберите тип электронной цифровой подписи (ЭЦП)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ecpOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleECPSelect(option.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedECP === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Shield
                          className={`w-6 h-6 flex-shrink-0 mt-1 ${
                            selectedECP === option.value ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Информация о компании
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-foreground">
                      Наименование компании *
                    </Label>
                    <Input
                      id="company_name"
                      {...register("company_name", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.company_name && (
                      <p className="text-sm text-destructive">{errors.company_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inn" className="text-foreground">
                      ИНН *
                    </Label>
                    <Input
                      id="inn"
                      {...register("inn", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.inn && <p className="text-sm text-destructive">{errors.inn.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogrn" className="text-foreground">
                      ОГРН *
                    </Label>
                    <Input
                      id="ogrn"
                      {...register("ogrn", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.ogrn && <p className="text-sm text-destructive">{errors.ogrn.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpp" className="text-foreground">
                      КПП
                    </Label>
                    <Input id="kpp" {...register("kpp")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-foreground">
                      Адрес *
                    </Label>
                    <Input
                      id="address"
                      {...register("address", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              {/* Director Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Информация о руководителе
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="director_name" className="text-foreground">
                      ФИО руководителя *
                    </Label>
                    <Input
                      id="director_name"
                      {...register("director_name", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.director_name && (
                      <p className="text-sm text-destructive">{errors.director_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="director_position" className="text-foreground">
                      Должность *
                    </Label>
                    <Input
                      id="director_position"
                      {...register("director_position", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.director_position && (
                      <p className="text-sm text-destructive">{errors.director_position.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Контактная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person" className="text-foreground">
                      Контактное лицо *
                    </Label>
                    <Input
                      id="contact_person"
                      {...register("contact_person", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.contact_person && (
                      <p className="text-sm text-destructive">{errors.contact_person.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-foreground">
                      Телефон *
                    </Label>
                    <Input
                      id="contact_phone"
                      {...register("contact_phone", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.contact_phone && (
                      <p className="text-sm text-destructive">{errors.contact_phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contact_email" className="text-foreground">
                      Email *
                    </Label>
                    <Input
                      id="contact_email"
                      type="email"
                      {...register("contact_email", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.contact_email && (
                      <p className="text-sm text-destructive">{errors.contact_email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Банковские реквизиты
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bank_name" className="text-foreground">
                      Наименование банка *
                    </Label>
                    <Input
                      id="bank_name"
                      {...register("bank_name", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.bank_name && <p className="text-sm text-destructive">{errors.bank_name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_account" className="text-foreground">
                      Расчетный счет *
                    </Label>
                    <Input
                      id="bank_account"
                      {...register("bank_account", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.bank_account && (
                      <p className="text-sm text-destructive">{errors.bank_account.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_bik" className="text-foreground">
                      БИК *
                    </Label>
                    <Input
                      id="bank_bik"
                      {...register("bank_bik", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.bank_bik && <p className="text-sm text-destructive">{errors.bank_bik.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_ks" className="text-foreground">
                      Корреспондентский счет
                    </Label>
                    <Input id="bank_ks" {...register("bank_ks")} className="bg-background border-border text-foreground" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">
                  Примечания
                </Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  className="bg-background border-border text-foreground"
                  rows={4}
                  placeholder="Дополнительная информация..."
                />
              </div>

              {/* Selected ECP Info */}
              {selectedECP && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Выбранная ЭЦП:</span>{" "}
                    {ecpOptions.find((opt) => opt.value === selectedECP)?.label}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between gap-4 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-border text-foreground bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <FileText className="w-4 h-4 mr-2" />
                  Подать заявку на аккредитацию
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
