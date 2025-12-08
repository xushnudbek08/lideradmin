"use client"

import { useState } from "react"
import { Search, Plus, Building2, Phone, Mail, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const clients = [
  {
    id: 1,
    name: "ООО Техносервис",
    inn: "7712345678",
    contact: "Иванов И.И.",
    phone: "+7 (999) 123-45-67",
    email: "info@technoservice.ru",
    applications: 5,
    status: "Активный",
  },
  {
    id: 2,
    name: "ИП Петров А.С.",
    inn: "771234567890",
    contact: "Петров А.С.",
    phone: "+7 (999) 234-56-78",
    email: "petrov@mail.ru",
    applications: 2,
    status: "Активный",
  },
  {
    id: 3,
    name: "ООО СтройМастер",
    inn: "7787654321",
    contact: "Сидоров С.С.",
    phone: "+7 (999) 345-67-89",
    email: "info@stroymaster.ru",
    applications: 8,
    status: "Активный",
  },
  {
    id: 4,
    name: "ООО ТрансЛогистик",
    inn: "7798765432",
    contact: "Козлов К.К.",
    phone: "+7 (999) 456-78-90",
    email: "info@translogistic.ru",
    applications: 3,
    status: "Неактивный",
  },
]

export default function AgentClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.inn.includes(searchQuery) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию, ИНН или контакту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input border-border text-foreground"
              />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Добавить клиента
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-foreground">{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">ИНН: {client.inn}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem className="text-foreground">Редактировать</DropdownMenuItem>
                    <DropdownMenuItem className="text-foreground">Создать заявку</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Контакт:</span>
                <span className="text-foreground">{client.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {client.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {client.email}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">Заявок: {client.applications}</span>
                <Badge
                  className={
                    client.status === "Активный"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                  }
                >
                  {client.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
