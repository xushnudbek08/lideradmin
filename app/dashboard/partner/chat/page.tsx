"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { messagesApi } from "@/lib/api"
import { toast } from "sonner"

export default function PartnerChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const response = await messagesApi.list(50, 0)
        setMessages(response.results || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast.error("Ошибка при загрузке сообщений")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim()) return

    try {
      await messagesApi.send(newMessage)
      setNewMessage("")
      // Refresh messages
      const response = await messagesApi.list(50, 0)
      setMessages(response.results || [])
    } catch (error: any) {
      toast.error(error.message || "Ошибка при отправке сообщения")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Загрузка сообщений...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Чат</h1>
        <p className="text-muted-foreground mt-1">Общение с командой и клиентами</p>
      </div>

      <Card className="bg-card border-border h-[calc(100vh-250px)] flex flex-col">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Сообщения
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Нет сообщений. Начните общение!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Введите сообщение..."
                className="flex-1 bg-background border-border text-foreground"
              />
              <Button
                variant="outline"
                size="icon"
                className="border-border text-foreground bg-transparent"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSend}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

