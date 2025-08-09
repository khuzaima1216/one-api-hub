import {
  Site,
  UserInfo,
  ApiKeyInfo,
  SiteUserResponse,
  SiteApiKeysResponse,
  SITE_TYPES,
} from '../types'
import { createLogger } from './logger'
import { ERROR_CODES, ErrorCode } from './errorCodes'

const logger = createLogger('siteapi')

// Helper function to get the correct user header field based on site type
const getUserHeaderField = (siteType?: string): string => {
  switch (siteType) {
    case SITE_TYPES.NEW_API:
      return 'new-api-user'
    case SITE_TYPES.VELOERA:
      return 'veloera-user'
    case SITE_TYPES.VOAPI:
      return 'voapi-user'
    default:
      return 'new-api-user'
  }
}

const getCheckInUrl = (site: Site): string => {
  switch (site.type) {
    case SITE_TYPES.NEW_API:
      return `${site.url}/api/user/check_in`
    case SITE_TYPES.VELOERA:
      return `${site.url}/api/user/check_in`
    case SITE_TYPES.VOAPI:
      return `${site.url}/api/user/clock_in`
    default:
      return `${site.url}/api/user/check_in`
  }
}

export class SiteApiService {
  private extractApiKeyItems(data: SiteApiKeysResponse['data']) {
    if (Array.isArray(data)) {
      return data
    }

    if (typeof data === 'object' && data !== null) {
      if ('items' in data && Array.isArray(data.items)) {
        return data.items
      }
      if ('records' in data && Array.isArray(data.records)) {
        return data.records
      }
      if ('data' in data && Array.isArray(data.data)) {
        return data.data
      }
    }
    return []
  }

  private buildHeaders(site: Site): Record<string, string> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${site.accessToken}`,
      'Content-Type': 'application/json',
    }

    if (site.type !== SITE_TYPES.ONE_HUB) {
      const userHeaderField = getUserHeaderField(site.type)
      headers[userHeaderField] = String(site.userId)
    }

    return headers
  }

  async getUserInfo(site: Site): Promise<UserInfo | null> {
    try {
      logger.debug('Getting user info for site', {
        siteName: site.name,
        siteUrl: site.url,
        siteType: site.type,
      })
      const url = `${site.url}/api/user/self`
      const userHeaderField = getUserHeaderField(site.type)
      logger.debug('Using header field for user ID', {
        siteName: site.name,
        headerField: userHeaderField,
        siteType: site.type,
      })

      const response = await fetch(url, {
        headers: this.buildHeaders(site),
      })

      logger.debug('getUserInfo response received', {
        siteName: site.name,
        status: response.status,
        statusText: response.statusText,
      })

      if (!response.ok) {
        logger.warn('getUserInfo response not OK', {
          siteName: site.name,
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(`Failed to fetch user info: ${response.statusText}`)
      }

      const result: SiteUserResponse = await response.json()
      logger.debug('getUserInfo API response parsed', {
        siteName: site.name,
        success: result.success,
        username: result.data?.username,
      })

      if (result.success && result.data) {
        logger.info('User info retrieved successfully', {
          siteName: site.name,
          username: result.data.username,
          quota: result.data.quota,
          usedQuota: result.data.used_quota,
        })
        return {
          id: result.data.id,
          username: result.data.username,
          displayName: result.data.display_name,
          quota: result.data.quota,
          usedQuota: result.data.used_quota,
          requestCount: result.data.request_count,
          group: result.data.group,
        }
      }

      logger.warn('getUserInfo returned unsuccessful result', {
        siteName: site.name,
      })
      return null
    } catch (error) {
      logger.error('Error querying user info for site', {
        siteName: site.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return null
    }
  }

  async getApiKeys(site: Site): Promise<ApiKeyInfo[]> {
    try {
      logger.debug('Getting API keys for site', {
        siteName: site.name,
        siteType: site.type,
      })
      const url = `${site.url}/api/token/?p=0&size=10`
      const userHeaderField = getUserHeaderField(site.type)
      logger.debug('Using header field for API keys request', {
        siteName: site.name,
        headerField: userHeaderField,
        siteType: site.type,
      })

      const response = await fetch(url, {
        headers: this.buildHeaders(site),
      })

      if (!response.ok) {
        logger.warn('Failed to fetch API keys', {
          siteName: site.name,
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(`Failed to fetch API keys: ${response.statusText}`)
      }

      const result: SiteApiKeysResponse = await response.json()
      if (result.success && result.data) {
        const items = this.extractApiKeyItems(result.data)

        if (items.length > 0) {
          logger.info('API keys retrieved successfully', {
            siteName: site.name,
            keyCount: items.length,
          })
          return items.map((item) => ({
            id: item.id,
            userId: item.user_id,
            key: item.key,
            name: item.name,
            status: item.status,
            createdTime: item.created_time,
            accessedTime: item.accessed_time,
            expiredTime: item.expired_time,
            remainQuota: item.remain_quota,
            unlimitedQuota: item.unlimited_quota,
            usedQuota: item.used_quota,
          }))
        }
      }

      logger.warn('API keys response was unsuccessful', { siteName: site.name })
      return []
    } catch (error) {
      logger.error('Error querying API keys for site', {
        siteName: site.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return []
    }
  }

  async validateSite(
    site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> {
    try {
      logger.info('Validating site credentials', {
        siteName: site.name,
        siteUrl: site.url,
        siteType: site.type,
      })
      const url = `${site.url}/api/user/self`
      logger.debug('Making validation request', { url })
      const userHeaderField = getUserHeaderField(site.type)
      logger.debug('Using header field for validation', {
        siteName: site.name,
        headerField: userHeaderField,
        siteType: site.type,
      })

      const response = await fetch(url, {
        headers: this.buildHeaders(site as Site),
      })

      logger.debug('Validation response received', {
        siteName: site.name,
        status: response.status,
        statusText: response.statusText,
      })

      if (!response.ok) {
        logger.warn('Site validation failed - response not OK', {
          siteName: site.name,
          status: response.status,
          statusText: response.statusText,
        })
        return false
      }

      const result: SiteUserResponse = await response.json()
      logger.debug('Validation API response', {
        siteName: site.name,
        success: result.success,
      })

      if (result.success) {
        logger.info('Site validation successful', { siteName: site.name })
      } else {
        logger.warn(
          'Site validation failed - API returned unsuccessful result',
          { siteName: site.name }
        )
      }

      return result.success
    } catch (error) {
      logger.error('Error validating site', {
        siteName: site.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return false
    }
  }

  async refreshSiteData(
    site: Site
  ): Promise<{ userInfo: UserInfo | null; apiKeys: ApiKeyInfo[] }> {
    const [userInfo, apiKeys] = await Promise.all([
      this.getUserInfo(site),
      this.getApiKeys(site),
    ])

    return { userInfo, apiKeys }
  }

  async checkIn(
    site: Site
  ): Promise<{ success: boolean; message: string; errorCode?: ErrorCode }> {
    try {
      logger.info('Performing check-in for site', {
        siteName: site.name,
        siteType: site.type,
      })
      const url = getCheckInUrl(site)
      const userHeaderField = getUserHeaderField(site.type)
      logger.debug('Using header field for check-in', {
        siteName: site.name,
        headerField: userHeaderField,
        siteType: site.type,
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(site),
      })

      logger.debug('Check-in response received', {
        siteName: site.name,
        status: response.status,
        statusText: response.statusText,
      })

      if (!response.ok) {
        logger.warn('Check-in response not OK', {
          siteName: site.name,
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(`Failed to check in: ${response.statusText}`)
      }

      const result = await response.json()
      logger.debug('Check-in API response', {
        siteName: site.name,
        success: result.success,
      })

      const checkInResult = {
        success: result.success,
        message: result.message,
      }

      if (result.success) {
        logger.info('Check-in successful', {
          siteName: site.name,
          message: checkInResult.message,
        })
      } else {
        logger.warn('Check-in failed', {
          siteName: site.name,
          message: checkInResult.message,
        })
      }
      return checkInResult
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Check-in failed'
      logger.error('Error during check-in', {
        siteName: site.name,
        error: errorMessage,
      })
      return {
        success: false,
        message: errorMessage,
        errorCode: ERROR_CODES.CHECKIN_FAILED,
      }
    }
  }
}
