import { EmployerAuthProvider } from '@/context/EmployerAuthContext';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <EmployerAuthProvider>
      {children}
    </EmployerAuthProvider>
  );
}
