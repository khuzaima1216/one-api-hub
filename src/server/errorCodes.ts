// API Error Codes
// These codes are returned by the backend and mapped to localized messages on the frontend

export const ERROR_CODES = {
  // Authentication & Password
  AUTH_PASSWORD_REQUIRED: 'AUTH_PASSWORD_REQUIRED',
  AUTH_PASSWORD_TOO_SHORT: 'AUTH_PASSWORD_TOO_SHORT',
  AUTH_CURRENT_PASSWORD_INCORRECT: 'AUTH_CURRENT_PASSWORD_INCORRECT',
  AUTH_PASSWORD_UPDATE_FAILED: 'AUTH_PASSWORD_UPDATE_FAILED',
  AUTH_INVALID_PASSWORD: 'AUTH_INVALID_PASSWORD',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_NO_TOKEN: 'AUTH_NO_TOKEN',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',

  // Check-in
  CHECKIN_FAILED: 'CHECKIN_FAILED',

  // Sites
  SITE_NOT_FOUND: 'SITE_NOT_FOUND',
  SITE_INVALID_CREDENTIALS: 'SITE_INVALID_CREDENTIALS',
  SITE_CREATE_FAILED: 'SITE_CREATE_FAILED',
  SITE_UPDATE_FAILED: 'SITE_UPDATE_FAILED',
  SITE_DELETE_FAILED: 'SITE_DELETE_FAILED',
  SITE_REFRESH_FAILED: 'SITE_REFRESH_FAILED',
  SITE_USER_QUERY_FAILED: 'SITE_USER_QUERY_FAILED',
  SITE_TOKENS_QUERY_FAILED: 'SITE_TOKENS_QUERY_FAILED',

  // Data operations
  DATA_EXPORT_FAILED: 'DATA_EXPORT_FAILED',
  DATA_IMPORT_FAILED: 'DATA_IMPORT_FAILED',
  DATA_FETCH_FAILED: 'DATA_FETCH_FAILED',

  // Generic errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// Helper function to create standardized error response
export const createErrorResponse = (
  errorCode: ErrorCode,
  message?: string
) => ({
  success: false,
  error: message || errorCode,
  errorCode,
})

// Helper function to create success response with message
export const createSuccessResponse = <T>(data?: T, message?: string) => ({
  success: true,
  data,
  message,
})
