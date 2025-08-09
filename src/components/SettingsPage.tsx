import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Settings2,
  Key,
  Download,
  Globe,
  FileText,
} from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import { BasicSettings } from './settings/BasicSettings'
import { PasswordSettings } from './settings/PasswordSettings'
import { ImportExportSettings } from './settings/ImportExportSettings'

type SettingsTab = 'basic' | 'password' | 'import-export'

interface SettingsPageProps {
  onBack: () => void
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('basic')
  const { t } = useI18n()

  const settingsOptions = [
    {
      id: 'basic' as const,
      label: t('settings.basic.title'),
      icon: Globe,
      description: t('settings.basic.description'),
    },
    {
      id: 'password' as const,
      label: t('settings.password.title'),
      icon: Key,
      description: t('settings.password.description'),
    },
    {
      id: 'import-export' as const,
      label: t('settings.importExport.title'),
      icon: Download,
      description: t('settings.importExport.description'),
    },
  ]

  const renderSettingsContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicSettings />
      case 'password':
        return <PasswordSettings />
      case 'import-export':
        return <ImportExportSettings />
      default:
        return <BasicSettings />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Settings2 className="h-6 w-6" />
            <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {t('settings.configuration')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {settingsOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.id}
                        variant={
                          activeTab === option.id ? 'secondary' : 'ghost'
                        }
                        className="w-full justify-start h-auto p-3"
                        onClick={() => setActiveTab(option.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const activeOption = settingsOptions.find(
                      (opt) => opt.id === activeTab
                    )
                    const Icon = activeOption?.icon || FileText
                    return (
                      <>
                        <Icon className="h-5 w-5" />
                        <span>{activeOption?.label}</span>
                      </>
                    )
                  })()}
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-6">
                {renderSettingsContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
