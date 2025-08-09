import { createContext } from 'react'

export interface AuthContextType {
  token: string | null
  login: (password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
