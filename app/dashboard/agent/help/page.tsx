"use client"

import { HelpCircle, Mail, Phone, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AgentHelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Помощь и поддержка</h1>
        <p className="text-muted-foreground mt-1">Здесь вы можете найти ответы на часто задаваемые вопросы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Телефон поддержки</CardTitle>
                <CardDescription>Свяжитесь с нами по телефону</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground mb-2">+7 (495) 123-45-67</p>
            <p className="text-sm text-muted-foreground">Пн-Пт: 9:00 - 18:00</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Email поддержки</CardTitle>
                <CardDescription>Напишите нам на почту</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground mb-2">support@lidergarant.ru</p>
            <p className="text-sm text-muted-foreground">Ответим в течение 24 часов</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <CardTitle className="text-foreground">Часто задаваемые вопросы</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Как создать заявку?</h3>
            <p className="text-sm text-muted-foreground">
              Нажмите на кнопку "Создать заявку" в боковом меню, заполните необходимые данные и сохраните заявку.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Как добавить клиента?</h3>
            <p className="text-sm text-muted-foreground">
              Перейдите в раздел "Клиенты" и нажмите на кнопку "Добавить клиента", заполните форму.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Как отследить статус заявки?</h3>
            <p className="text-sm text-muted-foreground">
              Все заявки отображаются в разделе "Мои заявки" с указанием текущего статуса.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

