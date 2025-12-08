"use client"

import { useState } from "react"
import { FileText, Upload, Download, Trash2, Eye, Search, FolderOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const documents = [
  {
    id: 1,
    name: "Устав компании.pdf",
    type: "PDF",
    size: "2.4 MB",
    date: "15.01.2025",
    status: "Подтверждён",
    category: "Учредительные документы",
  },
  {
    id: 2,
    name: "Свидетельство ОГРН.pdf",
    type: "PDF",
    size: "1.1 MB",
    date: "15.01.2025",
    status: "Подтверждён",
    category: "Регистрационные документы",
  },
  {
    id: 3,
    name: "Выписка ЕГРЮЛ.pdf",
    type: "PDF",
    size: "856 KB",
    date: "14.01.2025",
    status: "На проверке",
    category: "Регистрационные документы",
  },
  {
    id: 4,
    name: "Баланс 2024.xlsx",
    type: "XLSX",
    size: "345 KB",
    date: "10.01.2025",
    status: "Подтверждён",
    category: "Финансовые документы",
  },
  {
    id: 5,
    name: "Приказ о назначении директора.pdf",
    type: "PDF",
    size: "512 KB",
    date: "08.01.2025",
    status: "Требует обновления",
    category: "Кадровые документы",
  },
]

const statusColors: Record<string, string> = {
  Подтверждён: "bg-green-500/10 text-green-500 border-green-500/20",
  "На проверке": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Требует обновления": "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function ClientDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-card border-border border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Загрузите документы</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Перетащите файлы сюда или нажмите для выбора
              <br />
              <span className="text-xs">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (до 10 MB)</span>
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Выбрать файлы
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск документов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Мои документы ({filteredDocs.length})</CardTitle>
            <FolderOpen className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">{doc.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {doc.category} • {doc.size} • {doc.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[doc.status]}>{doc.status}</Badge>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
