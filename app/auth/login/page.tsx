"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const role = await login(username, password)
      router.push(`/dashboard/${role}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirishda xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Mobile logo */}
      <div className="lg:hidden mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="ЛидерГарант" width={40} height={40} className="w-10 h-10" />
          <span className="text-xl font-bold text-foreground">ЛидерГарант</span>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Вход в личный кабинет</h2>
        <p className="text-muted-foreground">Введите данные для входа в систему</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground">
            Логин (username)
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">
              Пароль
            </Label>
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Забыли пароль?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            "Вход..."
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Войти
            </>
          )}
        </Button>

        {/* Register link */}
        <p className="text-center text-muted-foreground text-sm">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="text-primary hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  )
}
