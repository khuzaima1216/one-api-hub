import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useI18n } from '@/hooks/useI18n'
import { getSiteTypeOptions } from '@/utils/siteType'
import {
  Plus,
  Edit,
  Globe,
  Key,
  Eye,
  EyeOff,
  User,
  FileText,
  Link,
  Settings,
} from 'lucide-react'
import type { Site, SiteType } from '@/types'
import { SITE_TYPES } from '@/types'

interface SiteDialogProps {
  onAdd?: (
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => Promise<void>
  onEdit?: (
    id: string,
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => Promise<void>
  isLoading: boolean
  site?: Site
  trigger?: React.ReactNode
  mode: 'add' | 'edit'
}

export const SiteDialog: React.FC<SiteDialogProps> = ({
  onAdd,
  onEdit,
  isLoading,
  site,
  trigger,
  mode,
}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [userId, setUserId] = useState<number>(0)
  const [type, setType] = useState<SiteType>(SITE_TYPES.NEW_API)
  const { toast } = useToast()
  const { t } = useI18n()
  const siteTypeOptions = getSiteTypeOptions(t)
  const [showAccessToken, setShowAccessToken] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && site) {
      setName(site.name)
      setAccessToken(site.accessToken)
      setUrl(site.url)
      setDescription(site.description || '')
      setUserId(site.userId || 0)
      setType(site.type || SITE_TYPES.NEW_API)
    } else {
      setName('')
      setAccessToken('')
      setUrl('')
      setDescription('')
      setUserId(0)
      setType(SITE_TYPES.NEW_API)
    }
  }, [mode, site, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !name.trim() ||
      !accessToken.trim() ||
      !url.trim() ||
      (type !== SITE_TYPES.ONE_HUB && !userId)
    ) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.fillRequiredFields'),
      })
      return
    }

    try {
      if (mode === 'edit' && site && onEdit) {
        await onEdit(site.id, name, accessToken, url, description, userId, type)
        toast({
          title: t('common.success'),
          description: t('toast.siteUpdated'),
        })
      } else if (mode === 'add' && onAdd) {
        await onAdd(name, accessToken, url, description, userId, type)
        toast({
          title: t('common.success'),
          description: t('toast.siteAdded'),
        })
      }

      if (mode === 'add') {
        setName('')
        setAccessToken('')
        setUrl('')
        setDescription('')
        setUserId(0)
        setType(SITE_TYPES.NEW_API)
      }
      setOpen(false)
    } catch {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description:
          mode === 'edit'
            ? t('toast.siteUpdateFailed')
            : t('toast.siteAddFailed'),
      })
    }
  }

  const defaultTrigger =
    mode === 'add' ? (
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        {t('site.addSite')}
      </Button>
    ) : (
      <Button variant="ghost" size="sm">
        <Edit className="w-4 h-4" />
      </Button>
    )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {mode === 'edit' ? t('site.editSite') : t('site.addNewSite')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? t('site.editSiteDesc') : t('site.addSiteDesc')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('site.siteName')} {t('site.required')}
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  placeholder={t('site.siteNamePlaceholder')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url" className="text-sm font-medium">
                {t('site.siteUrl')} {t('site.required')}
              </Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  placeholder={t('site.siteUrlPlaceholder')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accessToken" className="text-sm font-medium">
                {t('site.accessToken')} {t('site.required')}
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="accessToken"
                  type={showAccessToken ? 'text' : 'password'}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder={t('site.accessTokenPlaceholder')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowAccessToken((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showAccessToken ? 'Hide token' : 'Show token'}
                  disabled={isLoading}
                >
                  {showAccessToken ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {type !== SITE_TYPES.ONE_HUB && (
              <div className="grid gap-2">
                <Label htmlFor="userId" className="text-sm font-medium">
                  {t('site.userId')} {t('site.required')}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                    className="pl-10"
                    placeholder={t('site.userIdPlaceholder')}
                    disabled={isLoading}
                    type="number"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-medium">
                {t('site.type')} {t('site.required')}
              </Label>
              <div className="relative">
                <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                <Select
                  value={type}
                  onValueChange={(value: SiteType) => setType(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder={t('site.selectSiteType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {siteTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t('site.description')}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('site.descriptionPlaceholder')}
                disabled={isLoading}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? mode === 'edit'
                  ? t('site.updating')
                  : t('site.adding')
                : mode === 'edit'
                  ? t('site.updateSite')
                  : t('site.addSite')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Convenience components for specific use cases
export const AddSiteDialog: React.FC<{
  onAdd: (
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => Promise<void>
  isLoading: boolean
}> = ({ onAdd, isLoading }) => (
  <SiteDialog mode="add" onAdd={onAdd} isLoading={isLoading} />
)

export const EditSiteDialog: React.FC<{
  site: Site
  onEdit: (
    id: string,
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => Promise<void>
  isLoading: boolean
  trigger?: React.ReactNode
}> = ({ site, onEdit, isLoading, trigger }) => (
  <SiteDialog
    mode="edit"
    site={site}
    onEdit={onEdit}
    isLoading={isLoading}
    trigger={trigger}
  />
)
