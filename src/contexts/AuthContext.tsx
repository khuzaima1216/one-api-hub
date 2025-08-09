import React, { useState, useEffect } from 'react'
import type { ApiResponse, LoginResponse } from '@/types'
import { AuthContext } from './auth-context'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth-token')
    if (savedToken) {
      setToken(savedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const result: ApiResponse<LoginResponse> = await response.json()

      if (result.success && result.data) {
        setToken(result.data.token)
        localStorage.setItem('auth-token', result.data.token)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('auth-token')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
