import type { UserRole } from './types';

/**
 * Determines if a user role has "edit/add/delete" access to a specific module.
 * If this returns false, the user should be restricted to "View Only" mode.
 */
export function canEditModule(role: UserRole | undefined | string, moduleName: string): boolean {
  if (!role) return false;

  // Super admins, IT admins, and Admins can edit everything
  if (['super_admin', 'it_admin', 'admin'].includes(role)) {
    return true;
  }

  // Developer and Tester can typically view but let's restrict their edits to testing/dev modules if needed.
  // By default we will make them view only unless specified.

  switch (moduleName) {
    case 'requirements':
      // Recruiters can edit requirements/job board
      return ['recruiter'].includes(role);

    case 'candidates':
      // Recruiters and HR can edit candidates
      return ['recruiter', 'hr'].includes(role);

    case 'interviews':
      // Interviewers can edit interviews
      return ['interviewer'].includes(role);

    case 'placements':
      // Placement Coordinators can edit placements
      return ['placement_coordinator'].includes(role);

    case 'clients':
    case 'companies':
      // Placement Coordinators can edit clients/companies
      return ['placement_coordinator'].includes(role);

    case 'attendance':
    case 'leave_requests':
      // HR can edit attendance and leaves
      return ['hr'].includes(role);

    default:
      // By default, no edit access for undefined modules
      return false;
  }
}
