import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EditSiteDialog } from '@/components/SiteDialog'
import { useI18n } from '@/hooks/useI18n'
import { getSiteTypeDisplayName } from '@/utils/siteType'
import {
  MoreHorizontal,
  RefreshCw,
  Trash2,
  User,
  Key,
  Edit,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  Check,
  Calendar,
} from 'lucide-react'
import type { Site, ApiKeyInfo, SiteType } from '@/types'

interface SiteTableProps {
  sites: Site[]
  onQueryUser: (id: string) => void
  onQueryTokens: (id: string) => Promise<ApiKeyInfo[]>
  onEdit: (
    id: string,
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => Promise<void>
  onDelete: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onCheckIn?: (id: string) => void
  loadingStates: Record<string, boolean>
}

export const SiteTable: React.FC<SiteTableProps> = ({
  sites,
  onQueryUser,
  onQueryTokens,
  onEdit,
  onDelete,
  onBulkDelete,
  onCheckIn,
  loadingStates,
}) => {
  const [expandedSites, setExpandedSites] = useState<Record<string, boolean>>(
    {}
  )
  const [siteApiKeys, setSiteApiKeys] = useState<Record<string, ApiKeyInfo[]>>(
    {}
  )
  const [loadingApiKeys, setLoadingApiKeys] = useState<Record<string, boolean>>(
    {}
  )
  const [visibleApiKeys, setVisibleApiKeys] = useState<Record<string, boolean>>(
    {}
  )
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set())
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({})
  const { t } = useI18n()

  const formatQuota = (quota: number) => {
    if (quota < 0) return t('common.unlimited')
    return `$${(quota / 500000).toFixed(2)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length)
    return (
      key.substring(0, 4) +
      '*'.repeat(key.length - 8) +
      key.substring(key.length - 4)
    )
  }

  if (sites.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('siteTable.noSites')}
      </div>
    )
  }

  const toggleExpanded = async (siteId: string) => {
    const isExpanding = !expandedSites[siteId]
    setExpandedSites((prev) => ({ ...prev, [siteId]: isExpanding }))

    if (isExpanding && !siteApiKeys[siteId]) {
      setLoadingApiKeys((prev) => ({ ...prev, [siteId]: true }))
      try {
        const apiKeys = await onQueryTokens(siteId)
        setSiteApiKeys((prev) => ({ ...prev, [siteId]: apiKeys }))
      } catch (error) {
        console.error('Failed to load API keys:', error)
      } finally {
        setLoadingApiKeys((prev) => ({ ...prev, [siteId]: false }))
      }
    }
  }

  const toggleApiKeyVisibility = (apiKeyId: string) => {
    setVisibleApiKeys((prev) => ({ ...prev, [apiKeyId]: !prev[apiKeyId] }))
  }

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(siteId)) {
        newSet.delete(siteId)
      } else {
        newSet.add(siteId)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedSites.size === sites.length) {
      setSelectedSites(new Set())
    } else {
      setSelectedSites(new Set(sites.map((site) => site.id)))
    }
  }

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedSites.size > 0) {
      onBulkDelete(Array.from(selectedSites))
      setSelectedSites(new Set())
    }
  }

  const selectedSiteNames = sites
    .filter((site) => selectedSites.has(site.id))
    .map((site) => site.name)
    .join(', ')

  const copyApiKey = async (apiKey: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopiedKeys((prev) => ({ ...prev, [keyId]: true }))
      setTimeout(() => {
        setCopiedKeys((prev) => ({ ...prev, [keyId]: false }))
      }, 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const shouldShowToggleButton = (key: string) => {
    return key.length > 12
  }

  const refreshApiKeysIfExpanded = async (siteId: string) => {
    if (expandedSites[siteId] && siteApiKeys[siteId]) {
      setLoadingApiKeys((prev) => ({ ...prev, [siteId]: true }))
      try {
        const apiKeys = await onQueryTokens(siteId)
        setSiteApiKeys((prev) => ({ ...prev, [siteId]: apiKeys }))
      } catch (error) {
        console.error('Failed to refresh API keys:', error)
      } finally {
        setLoadingApiKeys((prev) => ({ ...prev, [siteId]: false }))
      }
    }
  }

  const handleRefreshApiKeys = async (siteId: string) => {
    // If API keys are currently expanded, refresh them
    if (expandedSites[siteId] && siteApiKeys[siteId]) {
      await refreshApiKeysIfExpanded(siteId)
    } else if (siteApiKeys[siteId]) {
      // If API keys are cached but collapsed, clear the cache so they refresh when expanded
      setSiteApiKeys((prev) => {
        const newState = { ...prev }
        delete newState[siteId]
        return newState
      })
    }
  }

  return (
    <div className="space-y-4">
      {onBulkDelete && sites.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedSites.size === sites.length && sites.length > 0}
              onCheckedChange={toggleSelectAll}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-sm font-medium">
              {selectedSites.size === 0
                ? t('siteTable.selectAll', { count: sites.length })
                : t('siteTable.selected', { count: selectedSites.size })}
            </span>
          </div>
          {selectedSites.size > 0 && (
            <ConfirmDialog
              title={t('siteTable.deleteSelected')}
              description={t('siteTable.deleteSelectedDesc', {
                count: selectedSites.size,
                names:
                  selectedSiteNames.length > 50
                    ? selectedSiteNames.substring(0, 50) + '...'
                    : selectedSiteNames,
              })}
              confirmText={t('siteTable.deleteAll')}
              cancelText={t('common.cancel')}
              onConfirm={handleBulkDelete}
              variant="destructive"
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('siteTable.deleteSelectedButton', {
                    count: selectedSites.size,
                  })}
                </Button>
              }
            />
          )}
        </div>
      )}
      {sites.map((site) => (
        <Card key={site.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onBulkDelete && (
                  <Checkbox
                    checked={selectedSites.has(site.id)}
                    onCheckedChange={() => toggleSiteSelection(site.id)}
                  />
                )}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(site.id)}
                    >
                      {expandedSites[site.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
                <div>
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {site.description || ''}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={loadingStates[site.id]}
                  >
                    {loadingStates[site.id] ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditSiteDialog
                    site={site}
                    onEdit={onEdit}
                    isLoading={loadingStates[site.id]}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('siteTable.edit')}
                      </DropdownMenuItem>
                    }
                  />
                  {expandedSites[site.id] && (
                    <DropdownMenuItem
                      onClick={() => handleRefreshApiKeys(site.id)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t('siteTable.refreshApiKeys')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onQueryUser(site.id)}>
                    <User className="mr-2 h-4 w-4" />
                    {t('siteTable.refreshAccount')}
                  </DropdownMenuItem>
                  {onCheckIn && (
                    <DropdownMenuItem onClick={() => onCheckIn(site.id)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {t('siteTable.checkIn')}
                    </DropdownMenuItem>
                  )}
                  <ConfirmDialog
                    title={t('siteTable.deleteSite')}
                    description={t('siteTable.deleteSiteDesc', {
                      name: site.name,
                    })}
                    confirmText={t('siteTable.delete')}
                    cancelText={t('common.cancel')}
                    onConfirm={() => onDelete(site.id)}
                    variant="destructive"
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('siteTable.delete')}
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
              <div className="md:col-span-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('siteTable.url')}
                </h4>
                <code className="text-sm truncate block" title={site.url}>
                  {site.url}
                </code>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('site.type')}
                </h4>
                <p className="text-sm truncate">
                  {getSiteTypeDisplayName(site.type, t)}
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('siteTable.user')}
                </h4>
                {site.username ? (
                  <p className="text-sm truncate">{site.username}</p>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t('siteTable.notQueried')}
                  </span>
                )}
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('siteTable.quota')}
                </h4>
                {site.quota !== undefined && site.quota !== null ? (
                  <p className="text-sm truncate">{formatQuota(site.quota)}</p>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t('siteTable.notQueried')}
                  </span>
                )}
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {t('siteTable.lastUpdated')}
                </h4>
                <p className="text-sm truncate">
                  {new Date(site.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <Collapsible open={expandedSites[site.id]}>
              <CollapsibleContent>
                <Separator className="my-4" />
                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    {t('siteTable.apiKeys')}
                    {loadingApiKeys[site.id] && (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    )}
                  </h4>

                  {loadingApiKeys[site.id] ? (
                    <div className="text-center py-4 text-muted-foreground">
                      {t('siteTable.loadingApiKeys')}
                    </div>
                  ) : siteApiKeys[site.id] &&
                    siteApiKeys[site.id].length > 0 ? (
                    <div className="space-y-3">
                      {siteApiKeys[site.id].map((apiKey) => (
                        <div
                          key={apiKey.id}
                          className="border rounded-lg p-3 bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">
                              {apiKey.name}
                            </h5>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  apiKey.status === 1
                                    ? 'default'
                                    : 'destructive'
                                }
                                className="text-xs"
                              >
                                {apiKey.status === 1
                                  ? t('siteTable.active')
                                  : t('siteTable.inactive')}
                              </Badge>
                              {apiKey.unlimitedQuota && (
                                <Badge variant="secondary" className="text-xs">
                                  {t('siteTable.unlimited')}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground min-w-[30px]">
                                {t('siteTable.key')}
                              </span>
                              <code className="text-xs truncate">
                                {visibleApiKeys[apiKey.id]
                                  ? apiKey.key
                                  : maskApiKey(apiKey.key)}
                              </code>
                              <div className="flex items-center space-x-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 flex-shrink-0"
                                  onClick={() =>
                                    copyApiKey(apiKey.key, apiKey.id.toString())
                                  }
                                  title={t('siteTable.copyApiKey')}
                                >
                                  {copiedKeys[apiKey.id] ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                                {shouldShowToggleButton(apiKey.key) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 flex-shrink-0"
                                    onClick={() =>
                                      toggleApiKeyVisibility(
                                        apiKey.id.toString()
                                      )
                                    }
                                    title={
                                      visibleApiKeys[apiKey.id]
                                        ? t('siteTable.hideApiKey')
                                        : t('siteTable.showApiKey')
                                    }
                                  >
                                    {visibleApiKeys[apiKey.id] ? (
                                      <EyeOff className="h-3 w-3" />
                                    ) : (
                                      <Eye className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">
                                  {t('siteTable.used')}{' '}
                                </span>
                                <span className="font-medium">
                                  {formatQuota(apiKey.usedQuota)}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  {t('siteTable.remain')}{' '}
                                </span>
                                <span className="font-medium">
                                  {apiKey.unlimitedQuota
                                    ? t('siteTable.unlimited')
                                    : formatQuota(apiKey.remainQuota)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div>
                              {t('siteTable.created')}{' '}
                              {formatDate(apiKey.createdTime)}
                            </div>
                            <div>
                              {t('siteTable.lastUsed')}{' '}
                              {formatDate(apiKey.accessedTime)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {t('siteTable.noApiKeys')}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
