import React, { useState, useEffect } from 'react'
import { I18nContext, type Language } from './i18n-context'

interface Translations {
  [key: string]: {
    [lang in Language]: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.oneApiHub': {
    en: 'One API Hub',
    zh: 'One API Hub',
  },
  'nav.admin': {
    en: 'Admin',
    zh: '管理员',
  },
  'nav.settings': {
    en: 'Settings',
    zh: '设置',
  },
  'nav.logout': {
    en: 'Log out',
    zh: '退出',
  },

  // Dashboard
  'dashboard.title': {
    en: 'Sites',
    zh: '站点',
  },
  'dashboard.subtitle': {
    en: 'Manage your One API sites',
    zh: '管理您的 One API 站点',
  },
  'dashboard.totalSites': {
    en: 'Total Sites',
    zh: '总站点数',
  },
  'dashboard.totalApiKeys': {
    en: 'Total API Keys',
    zh: 'API 密钥总数',
  },
  'dashboard.totalQuota': {
    en: 'Total Quota',
    zh: '总额度',
  },
  'dashboard.usageRate': {
    en: 'Usage Rate',
    zh: '使用率',
  },
  'dashboard.acrossAllSites': {
    en: 'Across all sites',
    zh: '所有站点',
  },
  'dashboard.used': {
    en: 'Used',
    zh: '已使用',
  },
  'dashboard.highUsage': {
    en: 'High usage',
    zh: '高使用率',
  },
  'dashboard.moderateUsage': {
    en: 'Moderate usage',
    zh: '中等使用率',
  },
  'dashboard.lowUsage': {
    en: 'Low usage',
    zh: '低使用率',
  },

  // Settings
  'settings.title': {
    en: 'Settings',
    zh: '设置',
  },
  'settings.configuration': {
    en: 'Configuration',
    zh: '配置',
  },
  'settings.basic.title': {
    en: 'Basic',
    zh: '基础设置',
  },
  'settings.basic.description': {
    en: 'Language and general preferences',
    zh: '语言和常规偏好设置',
  },
  'settings.password.title': {
    en: 'Password',
    zh: '密码',
  },
  'settings.password.description': {
    en: 'Change your account password',
    zh: '修改您的账户密码',
  },
  'settings.importExport.title': {
    en: 'Import/Export',
    zh: '导入/导出',
  },
  'settings.importExport.description': {
    en: 'Backup and restore your data',
    zh: '备份和恢复您的数据',
  },

  // Basic Settings
  'settings.basic.heading': {
    en: 'Basic Settings',
    zh: '基础设置',
  },
  'settings.basic.subtitle': {
    en: 'Configure your general preferences and display settings.',
    zh: '配置您的常规偏好和显示设置。',
  },
  'settings.basic.language': {
    en: 'Display Language',
    zh: '显示语言',
  },
  'settings.basic.languageDesc': {
    en: 'Choose your preferred language for the interface. This setting will be applied across the entire application.',
    zh: '选择您偏好的界面语言。此设置将应用于整个应用程序。',
  },
  'settings.basic.saveChanges': {
    en: 'Save Changes',
    zh: '保存更改',
  },
  'settings.basic.saving': {
    en: 'Saving...',
    zh: '保存中……',
  },

  // Password Settings
  'settings.password.heading': {
    en: 'Password Settings',
    zh: '密码设置',
  },
  'settings.password.subtitle': {
    en: 'Update your account password to keep your account secure.',
    zh: '更新您的账户密码以保证账户安全。',
  },
  'settings.password.guidelines': {
    en: 'Password Security Guidelines',
    zh: '密码安全指南',
  },
  'settings.password.rule1': {
    en: 'Use at least 6 characters',
    zh: '至少使用 6 个字符',
  },
  'settings.password.rule2': {
    en: 'Include a mix of letters, numbers, and symbols',
    zh: '包含字母、数字和符号的组合',
  },
  'settings.password.rule3': {
    en: 'Avoid using personal information',
    zh: '避免使用个人信息',
  },
  'settings.password.rule4': {
    en: "Don't reuse passwords from other accounts",
    zh: '不要重复使用其他账户的密码',
  },
  'settings.password.current': {
    en: 'Current Password',
    zh: '当前密码',
  },
  'settings.password.new': {
    en: 'New Password',
    zh: '新密码',
  },
  'settings.password.confirm': {
    en: 'Confirm New Password',
    zh: '确认新密码',
  },
  'settings.password.currentPlaceholder': {
    en: 'Enter your current password',
    zh: '请输入当前密码',
  },
  'settings.password.newPlaceholder': {
    en: 'Enter your new password (at least 6 characters)',
    zh: '请输入新密码（至少 6 个字符）',
  },
  'settings.password.confirmPlaceholder': {
    en: 'Confirm your new password',
    zh: '请再次输入新密码',
  },
  'settings.password.change': {
    en: 'Change Password',
    zh: '修改密码',
  },
  'settings.password.changing': {
    en: 'Changing...',
    zh: '修改中……',
  },

  // Import/Export Settings
  'settings.importExport.heading': {
    en: 'Import/Export Settings',
    zh: '导入/导出设置',
  },
  'settings.importExport.subtitle': {
    en: 'Backup your configuration data or restore from a previous backup.',
    zh: '备份您的配置数据或从之前的备份中恢复。',
  },
  'settings.importExport.exportTitle': {
    en: 'Export Data',
    zh: '导出数据',
  },
  'settings.importExport.exportDesc': {
    en: 'Download all your sites and configuration data as a JSON file.',
    zh: '将您的所有站点和配置数据下载为 JSON 文件。',
  },
  'settings.importExport.exportButton': {
    en: 'Export All Data',
    zh: '导出所有数据',
  },
  'settings.importExport.exporting': {
    en: 'Exporting...',
    zh: '导出中……',
  },
  'settings.importExport.importTitle': {
    en: 'Import Data',
    zh: '导入数据',
  },
  'settings.importExport.importDesc': {
    en: 'Restore your sites and configuration from a backup file.',
    zh: '从备份文件恢复您的站点和配置。',
  },
  'settings.importExport.selectFile': {
    en: 'Click to select a backup file',
    zh: '点击选择备份文件',
  },
  'settings.importExport.jsonOnly': {
    en: 'JSON files only',
    zh: '仅支持 JSON 文件',
  },
  'settings.importExport.selectButton': {
    en: 'Select Import File',
    zh: '选择导入文件',
  },
  'settings.importExport.importing': {
    en: 'Importing...',
    zh: '导入中……',
  },
  'settings.importExport.warningTitle': {
    en: 'Data Security Warning',
    zh: '数据安全警告',
  },
  'settings.importExport.warning1': {
    en: 'DO NOT share backup files with untrusted parties - they contain sensitive API tokens',
    zh: '不要与不信任的第三方分享备份文件 —— 它们包含敏感的 API 令牌',
  },
  'settings.importExport.warning2': {
    en: 'DO NOT store backup files in public repositories or cloud storage',
    zh: '不要将备份文件存储在公共存储库或云存储中',
  },
  'settings.importExport.tip1': {
    en: 'DO store backup files securely in encrypted storage',
    zh: '请将备份文件安全地存储在加密存储中',
  },
  'settings.importExport.tip2': {
    en: 'DO regularly rotate and update your API tokens after sharing backups',
    zh: '请在分享备份后定期轮换和更新您的 API 令牌',
  },
  'settings.importExport.overwriteWarning': {
    en: 'Importing data will overwrite all existing sites and configurations!',
    zh: '导入数据将覆盖所有现有站点和配置！',
  },

  // Site Management
  'site.addSite': {
    en: 'Add Site',
    zh: '添加站点',
  },
  'site.editSite': {
    en: 'Edit Site',
    zh: '编辑站点',
  },
  'site.addNewSite': {
    en: 'Add New Site',
    zh: '添加新站点',
  },
  'site.siteName': {
    en: 'Site Name',
    zh: '站点名称',
  },
  'site.siteUrl': {
    en: 'Site URL',
    zh: '站点 URL',
  },
  'site.accessToken': {
    en: 'Access Token',
    zh: '访问令牌',
  },
  'site.userId': {
    en: 'User ID',
    zh: '用户 ID',
  },
  'site.type': {
    en: 'Type',
    zh: '类型',
  },
  'site.type.newApi': {
    en: 'New API',
    zh: 'New API',
  },
  'site.type.veloera': {
    en: 'Veloera',
    zh: 'Veloera',
  },
  'site.type.onehub': {
    en: 'OneHub',
    zh: 'OneHub',
  },
  'site.type.voapi': {
    en: 'VoAPI',
    zh: 'VoAPI',
  },
  'site.description': {
    en: 'Description',
    zh: '描述',
  },
  'site.required': {
    en: '*',
    zh: '*',
  },
  'site.siteNamePlaceholder': {
    en: 'My One-API Site',
    zh: '我的 One-API 站点',
  },
  'site.siteUrlPlaceholder': {
    en: 'https://api.example.com',
    zh: 'https://api.example.com',
  },
  'site.accessTokenPlaceholder': {
    en: 'System Access Token',
    zh: '系统访问令牌',
  },
  'site.userIdPlaceholder': {
    en: '123',
    zh: '123',
  },
  'site.descriptionPlaceholder': {
    en: 'Optional description for this site',
    zh: '为此站点添加可选描述',
  },
  'site.selectSiteType': {
    en: 'Select site type',
    zh: '选择站点类型',
  },
  'site.updateSite': {
    en: 'Update Site',
    zh: '更新站点',
  },
  'site.updating': {
    en: 'Updating...',
    zh: '更新中……',
  },
  'site.adding': {
    en: 'Adding...',
    zh: '添加中……',
  },
  'site.editSiteDesc': {
    en: 'Update the site configuration.',
    zh: '更新站点配置',
  },
  'site.addSiteDesc': {
    en: 'Add a new One API site.',
    zh: '添加一个新的 One API 站点',
  },

  // Site Table
  'siteTable.noSites': {
    en: 'No sites added yet. Add your first site to get started.',
    zh: '还没有添加站点。添加您的第一个站点来开始使用。',
  },
  'siteTable.selectAll': {
    en: 'Select all {count} sites',
    zh: '选择所有 {count} 个站点',
  },
  'siteTable.selected': {
    en: '{count} selected',
    zh: '已选择 {count} 个',
  },
  'siteTable.deleteSelected': {
    en: 'Delete Selected Sites',
    zh: '删除选中的站点',
  },
  'siteTable.deleteSelectedDesc': {
    en: 'Are you sure you want to delete {count} site(s)? {names}. This action cannot be undone.',
    zh: '您确定要删除 {count} 个站点吗？{names}。此操作无法撤销。',
  },
  'siteTable.deleteAll': {
    en: 'Delete All',
    zh: '全部删除',
  },
  'siteTable.deleteSelectedButton': {
    en: 'Delete Selected ({count})',
    zh: '删除选中项 ({count})',
  },
  'siteTable.edit': {
    en: 'Edit',
    zh: '编辑',
  },
  'siteTable.refreshApiKeys': {
    en: 'Refresh API Keys',
    zh: '刷新 API 密钥',
  },
  'siteTable.refreshAccount': {
    en: 'Refresh Account',
    zh: '刷新账户',
  },
  'siteTable.checkIn': {
    en: 'Check In',
    zh: '签到',
  },
  'siteTable.delete': {
    en: 'Delete',
    zh: '删除',
  },
  'siteTable.deleteSite': {
    en: 'Delete Site',
    zh: '删除站点',
  },
  'siteTable.deleteSiteDesc': {
    en: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    zh: '您确定要删除"{name}"吗？此操作无法撤销。',
  },
  'siteTable.url': {
    en: 'URL',
    zh: 'URL',
  },
  'siteTable.user': {
    en: 'User',
    zh: '用户',
  },
  'siteTable.quota': {
    en: 'Quota',
    zh: '额度',
  },
  'siteTable.lastUpdated': {
    en: 'Last Updated',
    zh: '最后更新',
  },
  'siteTable.notQueried': {
    en: 'Not queried',
    zh: '未查询',
  },
  'siteTable.apiKeys': {
    en: 'API Keys',
    zh: 'API 密钥',
  },
  'siteTable.loadingApiKeys': {
    en: 'Loading API keys...',
    zh: '加载 API 密钥中……',
  },
  'siteTable.noApiKeys': {
    en: 'No API keys found',
    zh: '未找到 API 密钥',
  },
  'siteTable.active': {
    en: 'Enabled',
    zh: '启用',
  },
  'siteTable.inactive': {
    en: 'Disabled',
    zh: '禁用',
  },
  'siteTable.unlimited': {
    en: 'Unlimited',
    zh: '无限制',
  },
  'siteTable.key': {
    en: 'Key:',
    zh: '密钥：',
  },
  'siteTable.used': {
    en: 'Used:',
    zh: '已使用：',
  },
  'siteTable.remain': {
    en: 'Remain:',
    zh: '剩余：',
  },
  'siteTable.created': {
    en: 'Created:',
    zh: '创建时间：',
  },
  'siteTable.lastUsed': {
    en: 'Last Used:',
    zh: '最后使用：',
  },
  'siteTable.copyApiKey': {
    en: 'Copy API key',
    zh: '复制 API 密钥',
  },
  'siteTable.hideApiKey': {
    en: 'Hide API key',
    zh: '隐藏 API 密钥',
  },
  'siteTable.showApiKey': {
    en: 'Show API key',
    zh: '显示 API 密钥',
  },

  // Common
  'common.cancel': {
    en: 'Cancel',
    zh: '取消',
  },
  'common.confirm': {
    en: 'Confirm',
    zh: '确认',
  },
  'common.save': {
    en: 'Save',
    zh: '保存',
  },
  'common.error': {
    en: 'Error',
    zh: '错误',
  },
  'common.success': {
    en: 'Success',
    zh: '成功',
  },
  'common.unlimited': {
    en: 'Unlimited',
    zh: '无限制',
  },
  'common.loading': {
    en: 'Loading...',
    zh: '加载中……',
  },

  // Toast Messages
  'toast.languageSaved': {
    en: 'Language preference saved successfully',
    zh: '语言偏好设置已成功保存',
  },
  'toast.settingsSaveFailed': {
    en: 'Failed to save settings',
    zh: '保存设置失败',
  },
  'toast.passwordChanged': {
    en: 'Password changed successfully',
    zh: '密码修改成功',
  },
  'toast.passwordChangeFailed': {
    en: 'Password change failed',
    zh: '密码修改失败',
  },
  'toast.fillAllFields': {
    en: 'Please fill in all fields',
    zh: '请填写所有字段',
  },
  'toast.passwordMismatch': {
    en: 'New password and confirm password do not match',
    zh: '新密码和确认密码不匹配',
  },
  'toast.passwordTooShort': {
    en: 'New password must be at least 6 characters',
    zh: '新密码至少需要 6 个字符',
  },
  'toast.networkError': {
    en: 'Network error, please try again later',
    zh: '网络错误，请稍后重试',
  },
  'toast.exportSuccess': {
    en: 'Your data has been exported successfully',
    zh: '您的数据已成功导出',
  },
  'toast.exportFailed': {
    en: 'Failed to export data',
    zh: '导出数据失败',
  },
  'toast.importSuccess': {
    en: 'Your data has been imported successfully. Please refresh the page.',
    zh: '您的数据已成功导入。请刷新页面。',
  },
  'toast.importFailed': {
    en: 'Failed to import data',
    zh: '导入数据失败',
  },
  'toast.invalidFileType': {
    en: 'Please select a valid JSON file',
    zh: '请选择有效的 JSON 文件',
  },
  'toast.invalidJsonFormat': {
    en: 'Invalid JSON format',
    zh: '无效的 JSON 格式',
  },
  'toast.siteAdded': {
    en: 'Site added successfully',
    zh: '站点添加成功',
  },
  'toast.siteUpdated': {
    en: 'Site updated successfully',
    zh: '站点更新成功',
  },
  'toast.siteAddFailed': {
    en: 'Failed to add site',
    zh: '添加站点失败',
  },
  'toast.siteUpdateFailed': {
    en: 'Failed to update site',
    zh: '更新站点失败',
  },
  'toast.fillRequiredFields': {
    en: 'Please fill in all required fields',
    zh: '请填写所有必填字段',
  },
  'toast.fetchSitesFailed': {
    en: 'Failed to fetch sites',
    zh: '获取站点失败',
  },
  'toast.siteDeleted': {
    en: 'Site deleted successfully',
    zh: '站点删除成功',
  },
  'toast.siteDeleteFailed': {
    en: 'Failed to delete site',
    zh: '删除站点失败',
  },
  'toast.sitesDeleted': {
    en: '{count} sites deleted successfully',
    zh: '成功删除 {count} 个站点',
  },
  'toast.sitesDeleteFailed': {
    en: 'Failed to delete sites',
    zh: '删除站点失败',
  },
  'toast.siteRefreshed': {
    en: 'Site data refreshed successfully',
    zh: '站点数据刷新成功',
  },
  'toast.siteRefreshFailed': {
    en: 'Failed to refresh site data',
    zh: '刷新站点数据失败',
  },
  'toast.userQueryFailed': {
    en: 'Failed to query user info',
    zh: '查询用户信息失败',
  },
  'toast.checkInSuccess': {
    en: 'Check-in successful',
    zh: '签到成功',
  },
  'toast.checkInFailed': {
    en: 'Check-in failed',
    zh: '签到失败',
  },
  'toast.checkInError': {
    en: 'Failed to check in',
    zh: '签到请求失败',
  },
  'toast.enterPassword': {
    en: 'Please enter a password',
    zh: '请输入密码',
  },
  'toast.loginFailed': {
    en: 'Login Failed',
    zh: '登录失败',
  },
  'toast.invalidPassword': {
    en: 'Invalid password. Please try again.',
    zh: '密码错误，请重试。',
  },
  'toast.partialFailure': {
    en: 'Partial Failure',
    zh: '部分失败',
  },
  'toast.userInfoUpdated': {
    en: 'User Info Updated',
    zh: '账户信息已更新',
  },
  'toast.userInfoQueried': {
    en: 'User info queried',
    zh: '账户信息已查询',
  },
  'toast.partialDeleteResult': {
    en: '{success}/{total} sites deleted',
    zh: '已删除 {success}/{total} 个站点',
  },
  'toast.userInfoDisplay': {
    en: 'User: {username}',
    zh: '用户：{username}',
  },

  // API Error Code Messages
  'error.AUTH_PASSWORD_REQUIRED': {
    en: 'Current password and new password cannot be empty',
    zh: '当前密码和新密码不能为空',
  },
  'error.AUTH_PASSWORD_TOO_SHORT': {
    en: 'New password must be at least 6 characters',
    zh: '新密码至少需要 6 个字符',
  },
  'error.AUTH_CURRENT_PASSWORD_INCORRECT': {
    en: 'Current password is incorrect',
    zh: '当前密码不正确',
  },
  'error.AUTH_PASSWORD_UPDATE_FAILED': {
    en: 'Password update failed, please try again later',
    zh: '密码更新失败，请稍后重试',
  },
  'error.AUTH_INVALID_PASSWORD': {
    en: 'Invalid password',
    zh: '密码错误',
  },
  'error.AUTH_UNAUTHORIZED': {
    en: 'Unauthorized access',
    zh: '未授权访问',
  },
  'error.AUTH_NO_TOKEN': {
    en: 'No token provided',
    zh: '未提供令牌',
  },
  'error.AUTH_INVALID_TOKEN': {
    en: 'Invalid token',
    zh: '无效令牌',
  },
  'error.CHECKIN_FAILED': {
    en: 'Check-in failed',
    zh: '签到失败',
  },
  'error.SITE_NOT_FOUND': {
    en: 'Site not found',
    zh: '站点未找到',
  },
  'error.SITE_CREATE_FAILED': {
    en: 'Failed to create site',
    zh: '创建站点失败',
  },
  'error.SITE_UPDATE_FAILED': {
    en: 'Failed to update site',
    zh: '更新站点失败',
  },
  'error.SITE_DELETE_FAILED': {
    en: 'Failed to delete site',
    zh: '删除站点失败',
  },
  'error.SITE_INVALID_CREDENTIALS': {
    en: 'Invalid site credentials or connection failed',
    zh: '站点凭据无效或连接失败',
  },
  'error.SITE_REFRESH_FAILED': {
    en: 'Failed to refresh site data',
    zh: '刷新站点数据失败',
  },
  'error.SITE_USER_QUERY_FAILED': {
    en: 'Failed to query user info',
    zh: '查询用户信息失败',
  },
  'error.SITE_TOKENS_QUERY_FAILED': {
    en: 'Failed to query API keys',
    zh: '查询 API 密钥失败',
  },
  'error.DATA_EXPORT_FAILED': {
    en: 'Failed to export data',
    zh: '导出数据失败',
  },
  'error.DATA_IMPORT_FAILED': {
    en: 'Failed to import data',
    zh: '导入数据失败',
  },
  'error.DATA_FETCH_FAILED': {
    en: 'Failed to fetch sites',
    zh: '获取站点失败',
  },
  'error.INTERNAL_SERVER_ERROR': {
    en: 'Internal server error',
    zh: '服务器内部错误',
  },
  'error.INVALID_REQUEST': {
    en: 'Invalid request',
    zh: '无效请求',
  },
  'error.NETWORK_ERROR': {
    en: 'Network error',
    zh: '网络错误',
  },
  'error.UNKNOWN_ERROR': {
    en: 'Unknown error occurred',
    zh: '发生未知错误',
  },
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize from localStorage or default to English
    const savedLanguage = localStorage.getItem('language') as Language
    return savedLanguage || 'en'
  })

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[key]?.[language] || key

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value))
      })
    }

    return text
  }

  const updateLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  // Helper function to get error message from error code
  const getErrorMessage = (
    errorCode?: string,
    fallbackMessage?: string
  ): string => {
    if (errorCode) {
      const errorKey = `error.${errorCode}`
      if (translations[errorKey]) {
        return t(errorKey)
      }
    }
    return fallbackMessage || t('error.UNKNOWN_ERROR')
  }

  useEffect(() => {
    // Save language preference when it changes
    localStorage.setItem('language', language)
  }, [language])

  const value = {
    language,
    setLanguage: updateLanguage,
    t,
    getErrorMessage,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
