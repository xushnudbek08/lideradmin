"use client"

import { useState } from "react"
import { User, Building2, FileText, Bell, Lock, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function AgentSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
        <p className="text-muted-foreground mt-1">Управление настройками аккаунта и профиля</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4 mr-2" />
            Мой профиль
          </TabsTrigger>
          <TabsTrigger value="organization" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="w-4 h-4 mr-2" />
            Организация
          </TabsTrigger>
          <TabsTrigger value="requisites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="w-4 h-4 mr-2" />
            Реквизиты
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="w-4 h-4 mr-2" />
            Документы
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="password" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="w-4 h-4 mr-2" />
            Сменить пароль
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Мой профиль</CardTitle>
              <CardDescription>Основная информация о вашем профиле</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Управление персональными данными</p>
                <Link href="/dashboard/agent/profile">
                  <button className="text-primary hover:underline">Перейти к редактированию профиля</button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Организация</CardTitle>
              <CardDescription>Информация о вашей организации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Управление данными организации</p>
                <Link href="/dashboard/agent/company">
                  <button className="text-primary hover:underline">Перейти к информации об организации</button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisites" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Реквизиты</CardTitle>
              <CardDescription>Банковские реквизиты организации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Управление банковскими реквизитами</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground text-sm">Банк</span>
                    <span className="text-foreground text-sm font-medium">Не указан</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground text-sm">Расчетный счет</span>
                    <span className="text-foreground text-sm font-medium">Не указан</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground text-sm">БИК</span>
                    <span className="text-foreground text-sm font-medium">Не указан</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground text-sm">Корреспондентский счет</span>
                    <span className="text-foreground text-sm font-medium">Не указан</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Документы</CardTitle>
              <CardDescription>Управление документами организации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Загруженные документы организации</p>
                <div className="text-center py-8 text-muted-foreground">
                  Документы будут отображаться здесь
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Уведомления</CardTitle>
              <CardDescription>Настройка уведомлений</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="text-foreground font-medium">Email уведомления</p>
                    <p className="text-muted-foreground text-sm">Получать уведомления на email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="text-foreground font-medium">Уведомления о заявках</p>
                    <p className="text-muted-foreground text-sm">Уведомления об изменениях статуса заявок</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-foreground font-medium">Уведомления о клиентах</p>
                    <p className="text-muted-foreground text-sm">Уведомления о новых клиентах</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Сменить пароль</CardTitle>
              <CardDescription>Обновите пароль для безопасности аккаунта</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Текущий пароль</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="Введите текущий пароль"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Новый пароль</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="Введите новый пароль"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Подтвердите новый пароль</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="Повторите новый пароль"
                  />
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                  Сохранить пароль
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

