import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/hooks/useI18n'
import { Globe, Check } from 'lucide-react'

export const BasicSettings: React.FC = () => {
  const { language, setLanguage, t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'zh', label: '中文', flag: '🇨🇳' },
  ]

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Language preference is automatically saved by the I18nContext

      toast({
        title: t('common.success'),
        description: t('toast.languageSaved'),
      })
    } catch {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.settingsSaveFailed'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('settings.basic.heading')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('settings.basic.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <Label htmlFor="language" className="text-sm font-medium">
              {t('settings.basic.language')}
            </Label>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <div className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {t('settings.basic.languageDesc')}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            t('settings.basic.saving')
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              {t('settings.basic.saveChanges')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
