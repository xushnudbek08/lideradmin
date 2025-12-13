"use client"

import { useEffect, useState } from "react"
import { Building2, Loader2, Save, FileText, CreditCard, Users, User, Briefcase, FileCheck, Phone, Plus, Trash2, Edit2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { 
  companiesApi, 
  companyManagementApi, 
  companyFoundersApi, 
  companyContactsApi,
  type MyCompany,
  type CompanyManagement,
  type CompanyFounder,
  type CompanyContact
} from "@/lib/api"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClientCompanyPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState<MyCompany | null>(null)
  const [management, setManagement] = useState<CompanyManagement[]>([])
  const [founders, setFounders] = useState<CompanyFounder[]>([])
  const [contacts, setContacts] = useState<CompanyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [editingManagement, setEditingManagement] = useState<number | null>(null)
  const [editingFounder, setEditingFounder] = useState<number | null>(null)
  const [editingContact, setEditingContact] = useState<number | null>(null)
  const [showManagementForm, setShowManagementForm] = useState(false)
  const [showFounderForm, setShowFounderForm] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
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
      registration_date: "",
      registration_authority: "",
      registration_number: "",
      registration_certificate: "",
      
      // Деятельность и лицензии
      okved: "",
      activity_type: "",
      licenses: "",
      
      // Банк. реквизиты
      bank_name: "",
      bank_account: "",
      bank_bik: "",
      correspondent_account: "",
      
      // Реквизиты счетов ЭТП
      etp_accounts: "",
    },
  })

  // Forms for management, founders, contacts
  const managementForm = useForm<Omit<CompanyManagement, "id">>({
    defaultValues: {
      position: "",
      full_name: "",
      phone: "",
      email: "",
      passport_series: "",
      passport_number: "",
      passport_issued_by: "",
      passport_issued_date: "",
      inn: "",
    },
  })

  const founderForm = useForm<Omit<CompanyFounder, "id">>({
    defaultValues: {
      founder_type: "individual",
      full_name: "",
      company_name: "",
      inn: "",
      share_percentage: 0,
      share_amount: 0,
      passport_series: "",
      passport_number: "",
      passport_issued_by: "",
      passport_issued_date: "",
      address: "",
    },
  })

  const contactForm = useForm<Omit<CompanyContact, "id">>({
    defaultValues: {
      full_name: "",
      position: "",
      phone: "",
      email: "",
      is_main_contact: false,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [companyData, managementData, foundersData, contactsData] = await Promise.all([
          companiesApi.getMyCompany().catch(() => null),
          companyManagementApi.list().catch(() => []),
          companyFoundersApi.list().catch(() => []),
          companyContactsApi.list().catch(() => []),
        ])
        
        // Validate and set data
        const management = Array.isArray(managementData) ? managementData : []
        const founders = Array.isArray(foundersData) ? foundersData : []
        const contacts = Array.isArray(contactsData) ? contactsData : []

        if (companyData) {
          setCompany(companyData)
          reset({
            name: companyData.name || "",
            short_name: companyData.short_name || "",
            legal_address: companyData.legal_address || companyData.address || "",
            actual_address: companyData.actual_address || "",
            phone: companyData.phone || "",
            email: companyData.email || "",
            website: companyData.website || "",
            inn: companyData.inn || "",
            kpp: companyData.kpp || "",
            ogrn: companyData.ogrn || "",
            registration_date: companyData.registration_date || "",
            registration_authority: companyData.registration_authority || "",
            registration_number: companyData.registration_number || "",
            registration_certificate: companyData.registration_certificate || "",
            okved: companyData.okved || "",
            activity_type: companyData.activity_type || "",
            licenses: companyData.licenses ? JSON.stringify(companyData.licenses, null, 2) : "",
            bank_name: companyData.bank_name || "",
            bank_account: companyData.bank_account || "",
            bank_bik: companyData.bank_bik || "",
            correspondent_account: companyData.correspondent_account || "",
            etp_accounts: companyData.etp_accounts ? JSON.stringify(companyData.etp_accounts, null, 2) : "",
          })
        }

        setManagement(management)
        setFounders(founders)
        setContacts(contacts)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        toast.error("Ошибка при загрузке данных компании")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, reset])

  const onSubmit = async (data: any) => {
    if (!company) {
      toast.error("Компания не найдена")
      return
    }

    setIsSaving(true)
    try {
      let licenses = null
      let etp_accounts = null

      try {
        if (data.licenses) {
          licenses = JSON.parse(data.licenses)
        }
      } catch {
        toast.error("Ошибка в формате JSON для лицензий")
        setIsSaving(false)
        return
      }

      try {
        if (data.etp_accounts) {
          etp_accounts = JSON.parse(data.etp_accounts)
        }
      } catch {
        toast.error("Ошибка в формате JSON для реквизитов ЭТП")
        setIsSaving(false)
        return
      }

      const updated = await companiesApi.updateMyCompany({
        name: data.name,
        short_name: data.short_name || null,
        legal_address: data.legal_address || null,
        actual_address: data.actual_address || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        inn: data.inn || null,
        kpp: data.kpp || null,
        ogrn: data.ogrn || null,
        registration_date: data.registration_date || null,
        registration_authority: data.registration_authority || null,
        registration_number: data.registration_number || null,
        registration_certificate: data.registration_certificate || null,
        okved: data.okved || null,
        activity_type: data.activity_type || null,
        licenses: licenses,
        bank_name: data.bank_name || null,
        bank_account: data.bank_account || null,
        bank_bik: data.bank_bik || null,
        correspondent_account: data.correspondent_account || null,
        etp_accounts: etp_accounts,
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

  const handleSaveManagement = async (data: Omit<CompanyManagement, "id">) => {
    try {
      if (editingManagement) {
        await companyManagementApi.update(editingManagement, data)
        toast.success("Руководитель обновлен")
      } else {
        await companyManagementApi.create(data)
        toast.success("Руководитель добавлен")
      }
      const updated = await companyManagementApi.list()
      setManagement(updated)
      setShowManagementForm(false)
      setEditingManagement(null)
      managementForm.reset()
    } catch (error: any) {
      toast.error(error.message || "Ошибка при сохранении")
    }
  }

  const handleDeleteManagement = async (id: number) => {
    if (!confirm("Удалить руководителя?")) return
    try {
      await companyManagementApi.delete(id)
      toast.success("Руководитель удален")
      const updated = await companyManagementApi.list()
      setManagement(updated)
    } catch (error: any) {
      toast.error(error.message || "Ошибка при удалении")
    }
  }

  const handleEditManagement = (item: CompanyManagement) => {
    setEditingManagement(item.id)
    managementForm.reset({
      position: item.position,
      full_name: item.full_name,
      phone: item.phone || "",
      email: item.email || "",
      passport_series: item.passport_series || "",
      passport_number: item.passport_number || "",
      passport_issued_by: item.passport_issued_by || "",
      passport_issued_date: item.passport_issued_date || "",
      inn: item.inn || "",
    })
    setShowManagementForm(true)
  }

  const handleSaveFounder = async (data: Omit<CompanyFounder, "id">) => {
    try {
      if (editingFounder) {
        await companyFoundersApi.update(editingFounder, data)
        toast.success("Учредитель обновлен")
      } else {
        await companyFoundersApi.create(data)
        toast.success("Учредитель добавлен")
      }
      const updated = await companyFoundersApi.list()
      setFounders(updated)
      setShowFounderForm(false)
      setEditingFounder(null)
      founderForm.reset()
    } catch (error: any) {
      toast.error(error.message || "Ошибка при сохранении")
    }
  }

  const handleDeleteFounder = async (id: number) => {
    if (!confirm("Удалить учредителя?")) return
    try {
      await companyFoundersApi.delete(id)
      toast.success("Учредитель удален")
      const updated = await companyFoundersApi.list()
      setFounders(updated)
    } catch (error: any) {
      toast.error(error.message || "Ошибка при удалении")
    }
  }

  const handleEditFounder = (item: CompanyFounder) => {
    setEditingFounder(item.id)
    founderForm.reset({
      founder_type: item.founder_type,
      full_name: item.full_name || "",
      company_name: item.company_name || "",
      inn: item.inn || "",
      share_percentage: item.share_percentage || 0,
      share_amount: item.share_amount || 0,
      passport_series: item.passport_series || "",
      passport_number: item.passport_number || "",
      passport_issued_by: item.passport_issued_by || "",
      passport_issued_date: item.passport_issued_date || "",
      address: item.address || "",
    })
    setShowFounderForm(true)
  }

  const handleSaveContact = async (data: Omit<CompanyContact, "id">) => {
    try {
      if (editingContact) {
        await companyContactsApi.update(editingContact, data)
        toast.success("Контактное лицо обновлено")
      } else {
        await companyContactsApi.create(data)
        toast.success("Контактное лицо добавлено")
      }
      const updated = await companyContactsApi.list()
      setContacts(updated)
      setShowContactForm(false)
      setEditingContact(null)
      contactForm.reset()
    } catch (error: any) {
      toast.error(error.message || "Ошибка при сохранении")
    }
  }

  const handleDeleteContact = async (id: number) => {
    if (!confirm("Удалить контактное лицо?")) return
    try {
      await companyContactsApi.delete(id)
      toast.success("Контактное лицо удалено")
      const updated = await companyContactsApi.list()
      setContacts(updated)
    } catch (error: any) {
      toast.error(error.message || "Ошибка при удалении")
    }
  }

  const handleEditContact = (item: CompanyContact) => {
    setEditingContact(item.id)
    contactForm.reset({
      full_name: item.full_name,
      position: item.position,
      phone: item.phone,
      email: item.email,
      is_main_contact: item.is_main_contact || false,
    })
    setShowContactForm(true)
  }

  const founderType = founderForm.watch("founder_type")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Компания не найдена</h3>
            <p className="text-muted-foreground mb-4">У вас нет привязанной компании</p>
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

                  <div className="space-y-2">
                    <Label htmlFor="registration_number" className="text-foreground">
                      Номер регистрации
                    </Label>
                    <Input id="registration_number" {...register("registration_number")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="registration_certificate" className="text-foreground">
                      Свидетельство о регистрации
                    </Label>
                    <Input id="registration_certificate" {...register("registration_certificate")} className="bg-background border-border text-foreground" />
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

                  <div className="space-y-2">
                    <Label htmlFor="activity_type" className="text-foreground">
                      Тип деятельности
                    </Label>
                    <Input id="activity_type" {...register("activity_type")} className="bg-background border-border text-foreground" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="licenses" className="text-foreground">
                      Лицензии (JSON)
                    </Label>
                    <Textarea
                      id="licenses"
                      {...register("licenses")}
                      className="bg-background border-border text-foreground font-mono text-sm"
                      rows={8}
                      placeholder='[{"license_number": "12345", "license_type": "Лицензия на строительство", "issued_date": "2020-01-01", "expiry_date": "2025-01-01", "issued_by": "Ростехнадзор"}]'
                    />
                    <p className="text-xs text-muted-foreground">Формат: JSON массив объектов</p>
                  </div>
                </div>
              </TabsContent>

              {/* 4. Руководство */}
              <TabsContent value="management" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Руководство компании</h3>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowManagementForm(true)
                      setEditingManagement(null)
                      managementForm.reset()
                    }}
                    className="bg-primary text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить руководителя
                  </Button>
                </div>

                {showManagementForm && (
                  <Card className="bg-card border-border mb-4">
                    <CardContent className="p-4">
                      <form onSubmit={managementForm.handleSubmit(handleSaveManagement)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Должность *</Label>
                            <Input {...managementForm.register("position", { required: true })} />
                          </div>
                          <div className="space-y-2">
                            <Label>ФИО *</Label>
                            <Input {...managementForm.register("full_name", { required: true })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Телефон</Label>
                            <Input {...managementForm.register("phone")} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" {...managementForm.register("email")} />
                          </div>
                          <div className="space-y-2">
                            <Label>ИНН</Label>
                            <Input {...managementForm.register("inn")} />
                          </div>
                          <div className="space-y-2">
                            <Label>Серия паспорта</Label>
                            <Input {...managementForm.register("passport_series")} />
                          </div>
                          <div className="space-y-2">
                            <Label>Номер паспорта</Label>
                            <Input {...managementForm.register("passport_number")} />
                          </div>
                          <div className="space-y-2">
                            <Label>Кем выдан</Label>
                            <Input {...managementForm.register("passport_issued_by")} />
                          </div>
                          <div className="space-y-2">
                            <Label>Дата выдачи</Label>
                            <Input type="date" {...managementForm.register("passport_issued_date")} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="bg-primary text-primary-foreground">
                            Сохранить
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowManagementForm(false)
                              setEditingManagement(null)
                              managementForm.reset()
                            }}
                          >
                            Отмена
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {management.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет данных о руководстве</p>
                  ) : (
                    management.map((item) => (
                      <Card key={item.id} className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{item.full_name}</h4>
                              <p className="text-sm text-muted-foreground">{item.position}</p>
                              {item.phone && <p className="text-sm text-muted-foreground">Тел: {item.phone}</p>}
                              {item.email && <p className="text-sm text-muted-foreground">Email: {item.email}</p>}
                              {item.inn && <p className="text-sm text-muted-foreground">ИНН: {item.inn}</p>}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditManagement(item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteManagement(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* 5. Учредители */}
              <TabsContent value="founders" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Учредители компании</h3>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowFounderForm(true)
                      setEditingFounder(null)
                      founderForm.reset()
                    }}
                    className="bg-primary text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить учредителя
                  </Button>
                </div>

                {showFounderForm && (
                  <Card className="bg-card border-border mb-4">
                    <CardContent className="p-4">
                      <form onSubmit={founderForm.handleSubmit(handleSaveFounder)} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Тип учредителя *</Label>
                          <Select
                            value={founderType}
                            onValueChange={(value) => founderForm.setValue("founder_type", value as "individual" | "legal")}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Физическое лицо</SelectItem>
                              <SelectItem value="legal">Юридическое лицо</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {founderType === "individual" ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>ФИО *</Label>
                                <Input {...founderForm.register("full_name", { required: true })} />
                              </div>
                              <div className="space-y-2">
                                <Label>ИНН</Label>
                                <Input {...founderForm.register("inn")} />
                              </div>
                              <div className="space-y-2">
                                <Label>Доля участия (%)</Label>
                                <Input type="number" step="0.01" {...founderForm.register("share_percentage", { valueAsNumber: true })} />
                              </div>
                              <div className="space-y-2">
                                <Label>Сумма доли (руб.)</Label>
                                <Input type="number" step="0.01" {...founderForm.register("share_amount", { valueAsNumber: true })} />
                              </div>
                              <div className="space-y-2">
                                <Label>Серия паспорта</Label>
                                <Input {...founderForm.register("passport_series")} />
                              </div>
                              <div className="space-y-2">
                                <Label>Номер паспорта</Label>
                                <Input {...founderForm.register("passport_number")} />
                              </div>
                              <div className="space-y-2">
                                <Label>Кем выдан</Label>
                                <Input {...founderForm.register("passport_issued_by")} />
                              </div>
                              <div className="space-y-2">
                                <Label>Дата выдачи</Label>
                                <Input type="date" {...founderForm.register("passport_issued_date")} />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label>Адрес</Label>
                                <Input {...founderForm.register("address")} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Наименование компании *</Label>
                                <Input {...founderForm.register("company_name", { required: true })} />
                              </div>
                              <div className="space-y-2">
                                <Label>ИНН</Label>
                                <Input {...founderForm.register("inn")} />
                              </div>
                              <div className="space-y-2">
                                <Label>Доля участия (%)</Label>
                                <Input type="number" step="0.01" {...founderForm.register("share_percentage", { valueAsNumber: true })} />
                              </div>
                              <div className="space-y-2">
                                <Label>Сумма доли (руб.)</Label>
                                <Input type="number" step="0.01" {...founderForm.register("share_amount", { valueAsNumber: true })} />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button type="submit" className="bg-primary text-primary-foreground">
                            Сохранить
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowFounderForm(false)
                              setEditingFounder(null)
                              founderForm.reset()
                            }}
                          >
                            Отмена
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {founders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет данных об учредителях</p>
                  ) : (
                    founders.map((item) => (
                      <Card key={item.id} className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">
                                {item.founder_type === "individual" ? item.full_name : item.company_name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {item.founder_type === "individual" ? "Физическое лицо" : "Юридическое лицо"}
                              </p>
                              {item.inn && <p className="text-sm text-muted-foreground">ИНН: {item.inn}</p>}
                              {item.share_percentage && (
                                <p className="text-sm text-muted-foreground">Доля: {item.share_percentage}%</p>
                              )}
                              {item.share_amount && (
                                <p className="text-sm text-muted-foreground">
                                  Сумма: {item.share_amount.toLocaleString()} руб.
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditFounder(item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteFounder(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
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
                    <Label htmlFor="correspondent_account" className="text-foreground">
                      Корреспондентский счет
                    </Label>
                    <Input id="correspondent_account" {...register("correspondent_account")} className="bg-background border-border text-foreground" />
                  </div>
                </div>
              </TabsContent>

              {/* 7. Реквизиты счетов ЭТП */}
              <TabsContent value="etp" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="etp_accounts" className="text-foreground">
                    Реквизиты счетов на электронных торговых площадках (JSON)
                  </Label>
                  <Textarea
                    id="etp_accounts"
                    {...register("etp_accounts")}
                    className="bg-background border-border text-foreground font-mono text-sm"
                    rows={8}
                    placeholder='[{"platform_name": "Сбербанк-АСТ", "account_number": "12345678901234567890", "bik": "044525225"}]'
                  />
                  <p className="text-xs text-muted-foreground">Формат: JSON массив объектов</p>
                </div>
              </TabsContent>

              {/* 8. Контактные лица */}
              <TabsContent value="contacts" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Контактные лица</h3>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowContactForm(true)
                      setEditingContact(null)
                      contactForm.reset()
                    }}
                    className="bg-primary text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить контактное лицо
                  </Button>
                </div>

                {showContactForm && (
                  <Card className="bg-card border-border mb-4">
                    <CardContent className="p-4">
                      <form onSubmit={contactForm.handleSubmit(handleSaveContact)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>ФИО *</Label>
                            <Input {...contactForm.register("full_name", { required: true })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Должность *</Label>
                            <Input {...contactForm.register("position", { required: true })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Телефон *</Label>
                            <Input {...contactForm.register("phone", { required: true })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input type="email" {...contactForm.register("email", { required: true })} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                {...contactForm.register("is_main_contact")}
                                className="w-4 h-4"
                              />
                              Основное контактное лицо
                            </Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="bg-primary text-primary-foreground">
                            Сохранить
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowContactForm(false)
                              setEditingContact(null)
                              contactForm.reset()
                            }}
                          >
                            Отмена
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {contacts.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет контактных лиц</p>
                  ) : (
                    contacts.map((item) => (
                      <Card key={item.id} className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{item.full_name}</h4>
                                {item.is_main_contact && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Основное</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.position}</p>
                              <p className="text-sm text-muted-foreground">Тел: {item.phone}</p>
                              <p className="text-sm text-muted-foreground">Email: {item.email}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditContact(item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteContact(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
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
