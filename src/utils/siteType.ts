import { SITE_TYPES, type SiteType } from '@/types'

// Helper function to get localized site type display name
export const getSiteTypeDisplayName = (
  type: SiteType | undefined,
  t: (key: string) => string
): string => {
  const siteType = type || SITE_TYPES.NEW_API

  switch (siteType) {
    case SITE_TYPES.NEW_API:
      return t('site.type.newApi')
    case SITE_TYPES.VELOERA:
      return t('site.type.veloera')
    case SITE_TYPES.VOAPI:
      return t('site.type.voapi')
    case SITE_TYPES.ONE_HUB:
      return t('site.type.onehub')
    default:
      return siteType
  }
}

// Helper function to get all site type options for select components
export const getSiteTypeOptions = (t: (key: string) => string) => [
  { value: SITE_TYPES.NEW_API, label: t('site.type.newApi') },
  { value: SITE_TYPES.VELOERA, label: t('site.type.veloera') },
  { value: SITE_TYPES.VOAPI, label: t('site.type.voapi') },
  { value: SITE_TYPES.ONE_HUB, label: t('site.type.onehub') },
]
