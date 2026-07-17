import type { UserRole } from './types';

/**
 * Determines if a user role has "edit/add/delete" access to a specific module.
 * If this returns false, the user should be restricted to "View Only" mode.
 */
export function canEditModule(role: UserRole | undefined | string, moduleName: string): boolean {
  if (!role) return false;

  // Super admins and IT admins can edit everything
  if (['super_admin', 'it_admin'].includes(role)) {
    return true;
  }

  // Admin gets view-only for core recruitment modules
  if (role === 'admin') {
    const viewOnlyForAdmin = ['requirements', 'candidates', 'interviews', 'placements'];
    if (viewOnlyForAdmin.includes(moduleName)) return false;
    return true;
  }

  switch (moduleName) {
    case 'requirements':
      return ['recruiter'].includes(role);

    case 'candidates':
      return ['recruiter', 'hr'].includes(role);

    case 'interviews':
      return ['interviewer'].includes(role);

    case 'placements':
      return ['placement_coordinator'].includes(role);

    case 'clients':
    case 'companies':
      return ['placement_coordinator'].includes(role);

    case 'attendance':
    case 'leave_requests':
      return ['hr'].includes(role);

    default:
      return false;
  }
}
