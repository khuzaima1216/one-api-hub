import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { I18nProvider } from '@/contexts/I18nContext'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { LoginPage } from '@/components/LoginPage'
import { Dashboard } from '@/components/Dashboard'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

const AppContent: React.FC = () => {
  const { token, isLoading } = useAuth()
  const { t } = useI18n()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return token ? <Dashboard /> : <LoginPage />
}

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </I18nProvider>
  )
}

export default App
