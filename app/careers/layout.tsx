import type { ReactNode } from 'react';
import { CandidateAuthProvider } from '@/context/CandidateAuthContext';
import { PortalThemeProvider } from '@/context/PortalThemeContext';

export default function CareersLayout({ children }: { children: ReactNode }) {
  return (
    <PortalThemeProvider>
      <CandidateAuthProvider>
        {children}
      </CandidateAuthProvider>
    </PortalThemeProvider>
  );
}
