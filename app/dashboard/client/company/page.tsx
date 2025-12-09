"use client"

import { useEffect, useState } from "react"
import { Building2, Loader2, Save, FileText, CreditCard, Users, User, Briefcase, FileCheck, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { companiesApi } from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"

export default function ClientCompanyPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Общая информация
      name: "",
      short_name: "",
      legal_address: "",
      actual_address: "",
      phone: "",
      email: "",
      website: "",
      
      // Госрегистрация
      inn: "",
      kpp: "",
      ogrn: "",
      ogrn_date: "",
      registration_date: "",
      registration_authority: "",
      
      // Деятельность и лицензии
      okved: "",
      okved_description: "",
      licenses: "",
      
      // Руководство
      director_name: "",
      director_position: "",
      director_inn: "",
      director_phone: "",
      director_email: "",
      
      // Учредители
      founders: "",
      
      // Банк. реквизиты
      bank_name: "",
      bank_account: "",
      bank_bik: "",
      bank_ks: "",
      bank_inn: "",
      bank_kpp: "",
      
      // Реквизиты счетов ЭТП
      etp_accounts: "",
      
      // Контактные лица
      contact_person_1_name: "",
      contact_person_1_position: "",
      contact_person_1_phone: "",
      contact_person_1_email: "",
      contact_person_2_name: "",
      contact_person_2_position: "",
      contact_person_2_phone: "",
      contact_person_2_email: "",
    },
  })

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        if (user?.company) {
          const companyData = await companiesApi.get(user.company)
          setCompany(companyData)
          // Заполняем форму данными компании
          const requisites = companyData.requisites as any || {}
          reset({
            name: companyData.name || "",
            short_name: requisites.short_name || "",
            legal_address: companyData.address || "",
            actual_address: requisites.actual_address || "",
            phone: requisites.phone || "",
            email: requisites.email || "",
            website: requisites.website || "",
            inn: companyData.inn || "",
            kpp: requisites.kpp || "",
            ogrn: requisites.ogrn || "",
            ogrn_date: requisites.ogrn_date || "",
            registration_date: requisites.registration_date || "",
            registration_authority: requisites.registration_authority || "",
            okved: requisites.okved || "",
            okved_description: requisites.okved_description || "",
            licenses: requisites.licenses || "",
            director_name: requisites.director_name || "",
            director_position: requisites.director_position || "",
            director_inn: requisites.director_inn || "",
            director_phone: requisites.director_phone || "",
            director_email: requisites.director_email || "",
            founders: requisites.founders || "",
            bank_name: requisites.bank_name || "",
            bank_account: requisites.bank_account || "",
            bank_bik: requisites.bank_bik || "",
            bank_ks: requisites.bank_ks || "",
            bank_inn: requisites.bank_inn || "",
            bank_kpp: requisites.bank_kpp || "",
            etp_accounts: requisites.etp_accounts || "",
            contact_person_1_name: requisites.contact_person_1_name || "",
            contact_person_1_position: requisites.contact_person_1_position || "",
            contact_person_1_phone: requisites.contact_person_1_phone || "",
            contact_person_1_email: requisites.contact_person_1_email || "",
            contact_person_2_name: requisites.contact_person_2_name || "",
            contact_person_2_position: requisites.contact_person_2_position || "",
            contact_person_2_phone: requisites.contact_person_2_phone || "",
            contact_person_2_email: requisites.contact_person_2_email || "",
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

  const onSubmit = async (data: any) => {
    if (!user?.company) {
      toast.error("Компания не найдена")
      return
    }

    setIsSaving(true)
    try {
      const requisites = {
        short_name: data.short_name,
        actual_address: data.actual_address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        kpp: data.kpp,
        ogrn: data.ogrn,
        ogrn_date: data.ogrn_date,
        registration_date: data.registration_date,
        registration_authority: data.registration_authority,
        okved: data.okved,
        okved_description: data.okved_description,
        licenses: data.licenses,
        director_name: data.director_name,
        director_position: data.director_position,
        director_inn: data.director_inn,
        director_phone: data.director_phone,
        director_email: data.director_email,
        founders: data.founders,
        bank_name: data.bank_name,
        bank_account: data.bank_account,
        bank_bik: data.bank_bik,
        bank_ks: data.bank_ks,
        bank_inn: data.bank_inn,
        bank_kpp: data.bank_kpp,
        etp_accounts: data.etp_accounts,
        contact_person_1_name: data.contact_person_1_name,
        contact_person_1_position: data.contact_person_1_position,
        contact_person_1_phone: data.contact_person_1_phone,
        contact_person_1_email: data.contact_person_1_email,
        contact_person_2_name: data.contact_person_2_name,
        contact_person_2_position: data.contact_person_2_position,
        contact_person_2_phone: data.contact_person_2_phone,
        contact_person_2_email: data.contact_person_2_email,
      }

      const updated = await companiesApi.update(user.company, {
        name: data.name,
        inn: data.inn || null,
        address: data.legal_address,
        requisites: requisites,
      })
      
      if (updated) {
        setCompany(updated)
        toast.success("Данные компании успешно сохранены")
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка при сохранении данных")
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Моя компания</h1>
        <p className="text-muted-foreground mt-1">Управление данными вашей компании</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Информация о компании</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-6 bg-card border-border h-auto p-1">
                <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <FileText className="w-4 h-4 mr-1" />
                  Общая информация
                </TabsTrigger>
                <TabsTrigger value="registration" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <FileCheck className="w-4 h-4 mr-1" />
                  Госрегистрация
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Деятельность
                </TabsTrigger>
                <TabsTrigger value="management" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <User className="w-4 h-4 mr-1" />
                  Руководство
                </TabsTrigger>
                <TabsTrigger value="founders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  Учредители
                </TabsTrigger>
                <TabsTrigger value="bank" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Банк. реквизиты
                </TabsTrigger>
                <TabsTrigger value="etp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Реквизиты ЭТП
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                  <Phone className="w-4 h-4 mr-1" />
                  Контактные лица
                </TabsTrigger>
              </TabsList>

              {/* 1. Общая информация */}
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Наименование компании *
                    </Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_name" className="text-foreground">
                      Сокращенное наименование
                    </Label>
                    <Input id="short_name" {...register("short_name")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="legal_address" className="text-foreground">
                      Юридический адрес *
                    </Label>
                    <Input
                      id="legal_address"
                      {...register("legal_address", { required: "Обязательное поле" })}
                      className="bg-background border-border text-foreground"
                    />
                    {errors.legal_address && <p className="text-sm text-destructive">{errors.legal_address.message}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="actual_address" className="text-foreground">
                      Фактический адрес
                    </Label>
                    <Input id="actual_address" {...register("actual_address")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Телефон
                    </Label>
                    <Input id="phone" {...register("phone")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input id="email" type="email" {...register("email")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-foreground">
                      Веб-сайт
                    </Label>
                    <Input id="website" {...register("website")} className="bg-background border-border text-foreground" />
                  </div>
                </div>
              </TabsContent>

              {/* 2. Госрегистрация */}
              <TabsContent value="registration" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="kpp" className="text-foreground">
                      КПП
                    </Label>
                    <Input id="kpp" {...register("kpp")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogrn" className="text-foreground">
                      ОГРН
                    </Label>
                    <Input id="ogrn" {...register("ogrn")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogrn_date" className="text-foreground">
                      Дата присвоения ОГРН
                    </Label>
                    <Input id="ogrn_date" type="date" {...register("ogrn_date")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_date" className="text-foreground">
                      Дата регистрации
                    </Label>
                    <Input id="registration_date" type="date" {...register("registration_date")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_authority" className="text-foreground">
                      Орган регистрации
                    </Label>
                    <Input id="registration_authority" {...register("registration_authority")} className="bg-background border-border text-foreground" />
                  </div>
                </div>
              </TabsContent>

              {/* 3. Деятельность и лицензии */}
              <TabsContent value="activity" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="okved" className="text-foreground">
                      ОКВЭД
                    </Label>
                    <Input id="okved" {...register("okved")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="okved_description" className="text-foreground">
                      Описание вида деятельности
                    </Label>
                    <Textarea
                      id="okved_description"
                      {...register("okved_description")}
                      className="bg-background border-border text-foreground"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="licenses" className="text-foreground">
                      Лицензии
                    </Label>
                    <Textarea
                      id="licenses"
                      {...register("licenses")}
                      className="bg-background border-border text-foreground"
                      rows={4}
                      placeholder="Укажите имеющиеся лицензии..."
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 4. Руководство */}
              <TabsContent value="management" className="space-y-4">
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
                    {errors.director_name && <p className="text-sm text-destructive">{errors.director_name.message}</p>}
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
                    {errors.director_position && <p className="text-sm text-destructive">{errors.director_position.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="director_inn" className="text-foreground">
                      ИНН руководителя
                    </Label>
                    <Input id="director_inn" {...register("director_inn")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="director_phone" className="text-foreground">
                      Телефон руководителя
                    </Label>
                    <Input id="director_phone" {...register("director_phone")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="director_email" className="text-foreground">
                      Email руководителя
                    </Label>
                    <Input id="director_email" type="email" {...register("director_email")} className="bg-background border-border text-foreground" />
                  </div>
                </div>
              </TabsContent>

              {/* 5. Учредители */}
              <TabsContent value="founders" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="founders" className="text-foreground">
                    Информация об учредителях
                  </Label>
                  <Textarea
                    id="founders"
                    {...register("founders")}
                    className="bg-background border-border text-foreground"
                    rows={8}
                    placeholder="Укажите информацию об учредителях: ФИО, доля участия, документы..."
                  />
                </div>
              </TabsContent>

              {/* 6. Банк. реквизиты */}
              <TabsContent value="bank" className="space-y-4">
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
                    {errors.bank_account && <p className="text-sm text-destructive">{errors.bank_account.message}</p>}
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

                  <div className="space-y-2">
                    <Label htmlFor="bank_inn" className="text-foreground">
                      ИНН банка
                    </Label>
                    <Input id="bank_inn" {...register("bank_inn")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_kpp" className="text-foreground">
                      КПП банка
                    </Label>
                    <Input id="bank_kpp" {...register("bank_kpp")} className="bg-background border-border text-foreground" />
                  </div>
                </div>
              </TabsContent>

              {/* 7. Реквизиты счетов ЭТП */}
              <TabsContent value="etp" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="etp_accounts" className="text-foreground">
                    Реквизиты счетов на электронных торговых площадках
                  </Label>
                  <Textarea
                    id="etp_accounts"
                    {...register("etp_accounts")}
                    className="bg-background border-border text-foreground"
                    rows={8}
                    placeholder="Укажите реквизиты счетов на различных ЭТП: название площадки, номер счета, логин..."
                  />
                </div>
              </TabsContent>

              {/* 8. Контактные лица */}
              <TabsContent value="contacts" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Контактное лицо 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_person_1_name" className="text-foreground">
                        ФИО *
                      </Label>
                      <Input
                        id="contact_person_1_name"
                        {...register("contact_person_1_name", { required: "Обязательное поле" })}
                        className="bg-background border-border text-foreground"
                      />
                      {errors.contact_person_1_name && (
                        <p className="text-sm text-destructive">{errors.contact_person_1_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_person_1_position" className="text-foreground">
                        Должность *
                      </Label>
                      <Input
                        id="contact_person_1_position"
                        {...register("contact_person_1_position", { required: "Обязательное поле" })}
                        className="bg-background border-border text-foreground"
                      />
                      {errors.contact_person_1_position && (
                        <p className="text-sm text-destructive">{errors.contact_person_1_position.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_person_1_phone" className="text-foreground">
                        Телефон *
                      </Label>
                      <Input
                        id="contact_person_1_phone"
                        {...register("contact_person_1_phone", { required: "Обязательное поле" })}
                        className="bg-background border-border text-foreground"
                      />
                      {errors.contact_person_1_phone && (
                        <p className="text-sm text-destructive">{errors.contact_person_1_phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_person_1_email" className="text-foreground">
                        Email *
                      </Label>
                      <Input
                        id="contact_person_1_email"
                        type="email"
                        {...register("contact_person_1_email", { required: "Обязательное поле" })}
                        className="bg-background border-border text-foreground"
                      />
                      {errors.contact_person_1_email && (
                        <p className="text-sm text-destructive">{errors.contact_person_1_email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Контактное лицо 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_person_2_name" className="text-foreground">
                        ФИО
                      </Label>
                      <Input id="contact_person_2_name" {...register("contact_person_2_name")} className="bg-background border-border text-foreground" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_person_2_position" className="text-foreground">
                        Должность
                      </Label>
                      <Input id="contact_person_2_position" {...register("contact_person_2_position")} className="bg-background border-border text-foreground" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_person_2_phone" className="text-foreground">
                        Телефон
                      </Label>
                      <Input id="contact_person_2_phone" {...register("contact_person_2_phone")} className="bg-background border-border text-foreground" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_person_2_email" className="text-foreground">
                        Email
                      </Label>
                      <Input id="contact_person_2_email" type="email" {...register("contact_person_2_email")} className="bg-background border-border text-foreground" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
              <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить все изменения
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
