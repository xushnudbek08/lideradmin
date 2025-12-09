"use client"

import { useEffect, useState } from "react"
import { FileSignature, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AgentContractPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Мой договор</h1>
        <p className="text-muted-foreground mt-1">Просмотр и управление договором</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-foreground">Договор № 12345 от 15.01.2025</CardTitle>
              <CardDescription>Договор на оказание агентских услуг</CardDescription>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Действующий</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Дата подписания</span>
              <span className="text-foreground text-sm font-medium">15.01.2025</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Срок действия</span>
              <span className="text-foreground text-sm font-medium">15.01.2026</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Статус</span>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Активен</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground text-sm">Комиссия</span>
              <span className="text-foreground text-sm font-medium">2.5%</span>
            </div>
          </div>

          <div className="pt-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Скачать договор
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

