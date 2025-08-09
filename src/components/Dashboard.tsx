import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AddSiteDialog } from '@/components/SiteDialog'
import { SiteTable } from '@/components/SiteTable'
import { SettingsPage } from '@/components/SettingsPage'
import { useAuth } from '@/hooks/useAuth'
import { useI18n } from '@/hooks/useI18n'
import { useToast } from '@/hooks/use-toast'
import {
  LogOut,
  User,
  Settings,
  Globe,
  Key,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import type { Site, ApiResponse, UserInfo, ApiKeyInfo, SiteType } from '@/types'
import { ERROR_CODES } from '@/types'

export const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  )
  const [totalApiKeys, setTotalApiKeys] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>(
    'dashboard'
  )
  const { token, logout } = useAuth()
  const { t } = useI18n()
  const { toast } = useToast()

  const fetchSites = useCallback(async () => {
    try {
      const response = await fetch('/api/sites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result: ApiResponse<Site[]> = await response.json()

      if (!result.success) {
        const code = result.errorCode
        if (
          response.status === 401 ||
          code === ERROR_CODES.AUTH_INVALID_TOKEN ||
          code === ERROR_CODES.AUTH_NO_TOKEN ||
          code === ERROR_CODES.AUTH_UNAUTHORIZED
        ) {
          toast({
            variant: 'destructive',
            title: t('common.error'),
            description: code
              ? t(`error.${code}`)
              : t('error.AUTH_UNAUTHORIZED'),
          })
          logout()
          return
        }

        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: result.error || t('toast.fetchSitesFailed'),
        })
        return
      }

      if (result.data) {
        setSites(result.data)
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.fetchSitesFailed'),
      })
    }
  }, [token, toast, t, logout])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  const setSiteLoading = (siteId: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [siteId]: loading }))
  }

  const addSite = async (
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          accessToken,
          url,
          description,
          userId,
          type,
        }),
      })

      const result: ApiResponse<Site> = await response.json()
      if (result.success) {
        if (result.data) {
          setSites((prevSites) => [...prevSites, result.data!])
        }
      } else {
        throw new Error(result.error || 'Failed to add site')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add site'
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const editSite = async (
    id: string,
    name: string,
    accessToken: string,
    url: string,
    description: string,
    userId: number,
    type?: SiteType
  ) => {
    setSiteLoading(id, true)
    try {
      const response = await fetch(`/api/sites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          accessToken,
          url,
          description,
          userId,
          type,
        }),
      })

      const result: ApiResponse<Site> = await response.json()
      if (result.success) {
        if (result.data) {
          setSites((prevSites) =>
            prevSites.map((site) => (site.id === id ? result.data! : site))
          )
        }
      } else {
        throw new Error(result.error || 'Failed to update site')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add site'
      throw new Error(errorMessage)
    } finally {
      setSiteLoading(id, false)
    }
  }

  const deleteSite = async (id: string) => {
    try {
      const response = await fetch(`/api/sites/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result: ApiResponse<unknown> = await response.json()
      if (result.success) {
        setSites((prevSites) => prevSites.filter((site) => site.id !== id))
        toast({
          title: t('common.success'),
          description: t('toast.siteDeleted'),
        })
      } else {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: result.error || t('toast.siteDeleteFailed'),
        })
      }
    } catch (error) {
      console.error('Error deleting site:', error)
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.siteDeleteFailed'),
      })
    }
  }

  const bulkDeleteSites = async (ids: string[]) => {
    try {
      const promises = ids.map((id) =>
        fetch(`/api/sites/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )

      const results = await Promise.all(promises)
      const failedDeletes = results.filter((r) => !r.ok)

      if (failedDeletes.length === 0) {
        setSites((prevSites) =>
          prevSites.filter((site) => !ids.includes(site.id))
        )
        toast({
          title: t('common.success'),
          description: t('toast.sitesDeleted', { count: ids.length }),
        })
      } else {
        const successfulIds = ids.filter((id, index) => results[index].ok)
        setSites((prevSites) =>
          prevSites.filter((site) => !successfulIds.includes(site.id))
        )
        toast({
          variant: 'destructive',
          title: t('toast.partialFailure'),
          description: t('toast.partialDeleteResult', {
            success: results.length - failedDeletes.length,
            total: ids.length,
          }),
        })
      }
    } catch (error) {
      console.error('Error bulk deleting sites:', error)
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.sitesDeleteFailed'),
      })
    }
  }

  const queryUser = async (id: string) => {
    setSiteLoading(id, true)
    try {
      const response = await fetch(`/api/sites/${id}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result: ApiResponse<UserInfo> = await response.json()
      if (result.success && result.data) {
        const { username, quota, usedQuota } = result.data
        setSites((prevSites) =>
          prevSites.map((site) =>
            site.id === id
              ? {
                  ...site,
                  username,
                  quota,
                  usedQuota,
                }
              : site
          )
        )
        toast({
          title: t('toast.userInfoUpdated'),
          description: result.data
            ? t('toast.userInfoDisplay', { username: result.data.username })
            : t('toast.userInfoQueried'),
        })
      } else {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: result.error || t('toast.userQueryFailed'),
        })
      }
    } catch (error) {
      console.error('Error querying user:', error)
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.userQueryFailed'),
      })
    } finally {
      setSiteLoading(id, false)
    }
  }

  const queryTokens = useCallback(
    async (id: string): Promise<ApiKeyInfo[]> => {
      try {
        const response = await fetch(`/api/sites/${id}/tokens`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result: ApiResponse<ApiKeyInfo[]> = await response.json()
        if (result.success && result.data) {
          return result.data
        } else {
          throw new Error(result.error || 'Failed to query tokens')
        }
      } catch (error) {
        console.error('Error querying tokens:', error)
        throw error
      }
    },
    [token]
  )

  const checkIn = async (id: string) => {
    setSiteLoading(id, true)
    try {
      const response = await fetch(`/api/sites/${id}/checkin`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result: ApiResponse<{ message: string; userInfo?: UserInfo }> =
        await response.json()
      if (result.success) {
        if (result.data?.userInfo) {
          setSites((prevSites) =>
            prevSites.map((site) =>
              site.id === id
                ? { ...site, userInfo: result.data!.userInfo }
                : site
            )
          )
        }
        toast({
          title: t('common.success'),
          description: result.data?.message || t('toast.checkInSuccess'),
        })
      } else {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: result.data?.message || t('toast.checkInFailed'),
        })
      }
    } catch (error) {
      console.error('Error checking in:', error)
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('toast.checkInError'),
      })
    } finally {
      setSiteLoading(id, false)
    }
  }

  const fetchTotalApiKeys = useCallback(
    async (siteList: Site[]) => {
      try {
        const keyCounts = await Promise.all(
          siteList.map((site) =>
            queryTokens(site.id)
              .then((keys) => keys.length)
              .catch(() => 0)
          )
        )
        const totalKeys = keyCounts.reduce((sum, count) => sum + count, 0)
        setTotalApiKeys(totalKeys)
      } catch (error) {
        console.error('Error fetching total API keys:', error)
      }
    },
    [queryTokens]
  )

  useEffect(() => {
    if (sites.length > 0) {
      fetchTotalApiKeys(sites)
    }
  }, [sites.length, fetchTotalApiKeys]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalQuota = sites.reduce((sum, s) => sum + (s.quota || 0), 0)
  const totalUsedQuota = sites.reduce((sum, s) => sum + (s.usedQuota || 0), 0)

  // Calculate quota usage rate
  const quotaUsageRate =
    totalQuota > 0 ? (totalUsedQuota / totalQuota) * 100 : 0

  const formatQuota = (quota: number) => {
    if (quota < 0) return t('common.unlimited')
    return `$${(quota / 500000).toFixed(2)}`
  }

  // Render different pages based on currentPage state
  if (currentPage === 'settings') {
    return <SettingsPage onBack={() => setCurrentPage('dashboard')} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Globe className="h-6 w-6" />
            <h1 className="text-xl font-semibold">{t('nav.oneApiHub')}</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('nav.admin')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('nav.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalSites')}
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sites.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalApiKeys')}
              </CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApiKeys}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalQuota')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatQuota(totalQuota)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('dashboard.used')}: {formatQuota(totalUsedQuota)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.usageRate')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotaUsageRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {quotaUsageRate > 80
                  ? t('dashboard.highUsage')
                  : quotaUsageRate > 50
                    ? t('dashboard.moderateUsage')
                    : t('dashboard.lowUsage')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('dashboard.title')}
            </h2>
            <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
          </div>
          <AddSiteDialog onAdd={addSite} isLoading={isLoading} />
        </div>

        <SiteTable
          sites={sites}
          onQueryUser={queryUser}
          onQueryTokens={queryTokens}
          onEdit={editSite}
          onDelete={deleteSite}
          onBulkDelete={bulkDeleteSites}
          onCheckIn={checkIn}
          loadingStates={loadingStates}
        />
      </div>
    </div>
  )
}
