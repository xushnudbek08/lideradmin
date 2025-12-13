"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Upload, Download, RefreshCw, Search, FolderOpen, Loader2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { documentsApi } from "@/lib/api"
import { toast } from "sonner"

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

const docTypeLabels: Record<string, string> = {
  statute: "Учредительные документы",
  accounting: "Финансовые документы",
  other: "Другое",
}

export default function ClientDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documentsList, setDocumentsList] = useState(documents)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [docType, setDocType] = useState<string>("other")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocs = documentsList.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const validFiles: File[] = []
    const maxSize = 10 * 1024 * 1024 // 10 MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ]

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        toast.error(`Файл ${file.name} превышает размер 10 MB`)
        return
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Файл ${file.name} имеет недопустимый формат`)
        return
      }
      validFiles.push(file)
    })

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Выберите файлы для загрузки")
      return
    }

    if (!docType) {
      toast.error("Выберите тип документа")
      return
    }

    setIsUploading(true)
    try {
      for (const file of selectedFiles) {
        await documentsApi.upload(file, docType)
      }
      toast.success(`Успешно загружено файлов: ${selectedFiles.length}`)
      setSelectedFiles([])
      // Здесь можно обновить список документов, если есть API для получения списка
      // const updatedDocs = await documentsApi.list()
      // setDocumentsList(updatedDocs)
    } catch (error: any) {
      toast.error(error.message || "Ошибка при загрузке документов")
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`bg-card border-border border-dashed ${isDragging ? "border-primary bg-primary/5" : ""}`}>
        <CardContent className="p-8">
          <div
            className="flex flex-col items-center justify-center text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Загрузите документы</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Перетащите файлы сюда или нажмите для выбора
              <br />
              <span className="text-xs">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (до 10 MB)</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col gap-4 w-full max-w-md">
              <div className="space-y-2">
                <Label className="text-foreground">Тип документа</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Выберите тип документа" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="statute">Учредительные документы</SelectItem>
                    <SelectItem value="accounting">Финансовые документы</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleButtonClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
              <Upload className="w-4 h-4 mr-2" />
              Выбрать файлы
            </Button>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="w-full max-w-md mt-6 space-y-2">
                <Label className="text-foreground">Выбранные файлы:</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading || !docType}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Загрузить файлы ({selectedFiles.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Поиск документов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border text-foreground h-9"
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
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <RefreshCw className="w-4 h-4" />
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
