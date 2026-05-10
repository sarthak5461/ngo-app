// Role-based access control definitions.
// Wire-in for production: replace cookie-based check in middleware with JWT/Session validation.

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CONTENT_EDITOR: 'content_editor',
  REPORT_MANAGER: 'report_manager',
}

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.CONTENT_EDITOR]: 'Content Editor',
  [ROLES.REPORT_MANAGER]: 'Report Manager',
}

// Permissions are grouped by feature area.
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard:view',
  DONATIONS_VIEW: 'donations:view',
  DONATIONS_EXPORT: 'donations:export',
  MEMBERS_VIEW: 'members:view',
  MEMBERS_EDIT: 'members:edit',
  VOLUNTEERS_VIEW: 'volunteers:view',
  CSR_VIEW: 'csr:view',
  CONTENT_VIEW: 'content:view',
  CONTENT_EDIT: 'content:edit',
  MEDIA_VIEW: 'media:view',
  MEDIA_UPLOAD: 'media:upload',
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  USERS_VIEW: 'users:view',
  USERS_EDIT: 'users:edit',
}

const ALL = Object.values(PERMISSIONS)

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ALL,
  [ROLES.ADMIN]: ALL.filter(p => !['users:edit', 'settings:edit'].includes(p)),
  [ROLES.CONTENT_EDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.CONTENT_VIEW, PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.MEDIA_VIEW, PERMISSIONS.MEDIA_UPLOAD,
  ],
  [ROLES.REPORT_MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.DONATIONS_VIEW, PERMISSIONS.DONATIONS_EXPORT,
    PERMISSIONS.MEMBERS_VIEW, PERMISSIONS.VOLUNTEERS_VIEW, PERMISSIONS.CSR_VIEW,
  ],
}

export function hasPermission(role, perm) {
  return (ROLE_PERMISSIONS[role] || []).includes(perm)
}
