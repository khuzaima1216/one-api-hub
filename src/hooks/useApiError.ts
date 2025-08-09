import { useI18n } from '@/hooks/useI18n'
import type { ApiResponse } from '@/types'

// Custom hook for handling API errors with i18n support
export const useApiError = () => {
  const { getErrorMessage } = useI18n()

  const handleApiError = (result: ApiResponse<unknown>): string => {
    if (result.success) return ''

    // Priority: errorCode > error message > fallback
    return getErrorMessage(result.errorCode, result.error)
  }

  return { handleApiError }
}
