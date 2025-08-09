// Site types enum
export const SITE_TYPES = {
  NEW_API: 'new-api',
  VELOERA: 'veloera',
  VOAPI: 'voapi',
  ONE_HUB: 'one-hub',
} as const

export type SiteType = (typeof SITE_TYPES)[keyof typeof SITE_TYPES]

export interface Site {
  id: string
  name: string
  accessToken: string
  url: string
  description: string
  userId: number
  type?: SiteType
  // Flattened user info fields
  username?: string
  usedQuota?: number
  quota?: number
  createdAt: Date
  updatedAt: Date
}

export interface UserInfo {
  id: number
  username: string
  displayName: string
  quota: number
  usedQuota: number
  requestCount: number
  group: string
}

export interface ApiKeyInfo {
  id: number
  userId: number
  key: string
  name: string
  status: number
  createdTime: number
  accessedTime: number
  expiredTime: number
  remainQuota: number
  unlimitedQuota: boolean
  usedQuota: number
}

export interface User {
  id: string
  username: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export interface LoginRequest {
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface LoginResponse {
  token: string
  user: Omit<User, 'passwordHash'>
}

export interface SiteUserResponse {
  data: {
    id: number
    username: string
    display_name: string
    quota: number
    used_quota: number
    request_count: number
    group: string
  }
  message: string
  success: boolean
}

type ApiKeyItem = {
  id: number
  user_id: number
  key: string
  name: string
  status: number
  created_time: number
  accessed_time: number
  expired_time: number
  remain_quota: number
  unlimited_quota: boolean
  used_quota: number
}

export interface SiteApiKeysResponse {
  data:
    | {
        items: ApiKeyItem[]
        page?: number
        page_size?: number
        total?: number
      }
    | {
        records: ApiKeyItem[]
        page?: number
        page_size?: number
        total?: number
      }
    | {
        data: ApiKeyItem[]
        page?: number
        page_size?: number
        total?: number
      }
    | ApiKeyItem[]
  message: string
  success: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

// Re-export error codes for frontend use
export { ERROR_CODES } from '../server/errorCodes'
export type { ErrorCode } from '../server/errorCodes'
