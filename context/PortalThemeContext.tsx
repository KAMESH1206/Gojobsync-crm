'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface PortalThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const PortalThemeContext = createContext<PortalThemeContextType | undefined>(undefined);

export function PortalThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('portal_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portal_theme', nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <PortalThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {!mounted ? (
        <div style={{ visibility: 'hidden' }}>{children}</div>
      ) : (
        children
      )}
    </PortalThemeContext.Provider>
  );
}

export function usePortalTheme() {
  const context = useContext(PortalThemeContext);
  if (context === undefined) {
    throw new Error('usePortalTheme must be used within a PortalThemeProvider');
  }
  return context;
}
