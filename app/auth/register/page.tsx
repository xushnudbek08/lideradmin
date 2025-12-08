"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { authApi, type UserRole } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<UserRole>("client")
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }
    if (!agreeToTerms) {
      setError("Необходимо согласие на обработку персональных данных")
      return
    }

    setIsLoading(true)

    try {
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        role: role,
      })

      // Registratsiyadan keyin login sahifasiga yo'naltirish
      router.push("/auth/login?registered=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Регистрацияда хатолик юз берди")
    } finally {
      setIsLoading(false)
    }
  }

  const roles = [
    { value: "client", label: "Клиент" },
    { value: "agent", label: "Агент" },
    { value: "partner", label: "Партнёр" },
  ]

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
        <h2 className="text-2xl font-bold text-foreground mb-2">Регистрация</h2>
        <p className="text-muted-foreground">Создайте аккаунт для работы с платформой</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Role selection */}
        <div className="space-y-3">
          <Label className="text-foreground">Выберите роль</Label>
          <RadioGroup
            value={role}
            onValueChange={(value: UserRole) => setRole(value)}
            className="grid grid-cols-3 gap-2"
          >
            {roles.map((r) => (
              <div key={r.value}>
                <RadioGroupItem value={r.value} id={`reg-${r.value}`} className="peer sr-only" />
                <Label
                  htmlFor={`reg-${r.value}`}
                  className="flex items-center justify-center px-3 py-2 border border-border rounded-lg cursor-pointer text-sm font-medium text-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-primary/10 hover:bg-secondary transition-colors"
                >
                  {r.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground">
            Логин (username)
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">
              Имя
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Иван"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">
              Фамилия
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Иванов"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Телефон
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={formData.phone}
            onChange={handleChange}
            required
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            Пароль
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
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

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground">
            Подтвердите пароль
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
            className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
            Я согласен на обработку{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              персональных данных
            </Link>
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading || !agreeToTerms}
        >
          {isLoading ? (
            "Регистрация..."
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Зарегистрироваться
            </>
          )}
        </Button>

        {/* Login link */}
        <p className="text-center text-muted-foreground text-sm">
          Уже есть аккаунт?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Войти
          </Link>
        </p>
      </form>
    </div>
  )
}
