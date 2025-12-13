"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi, type UserProfile, type UserRole } from "@/lib/api"

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<UserRole>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshProfile = async () => {
    try {
      const profile = await authApi.getProfile()
      setUser(profile)
    } catch {
      setUser(null)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token")
      if (token) {
        await refreshProfile()
      }
      setIsLoading(false)
    }
    initAuth()

    // Auto-refresh token every 4 minutes (before 5 minute expiry)
    const tokenRefreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const response = await authApi.refreshToken(refreshToken)
          if (response.access) {
            localStorage.setItem("access_token", response.access)
            // Silently refresh profile to keep user data up to date
            await refreshProfile()
          }
        } catch (error) {
          // Refresh failed, user will be logged out on next API call
          console.error("Token refresh failed:", error)
        }
      }
    }, 4 * 60 * 1000) // 4 minutes

    return () => clearInterval(tokenRefreshInterval)
  }, [])

  const login = async (username: string, password: string): Promise<UserRole> => {
    const response = await authApi.login(username, password)
    localStorage.setItem("access_token", response.access)
    localStorage.setItem("refresh_token", response.refresh)

    const profile = await authApi.getProfile()
    setUser(profile)
    return profile.role
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
