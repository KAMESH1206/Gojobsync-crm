'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast animate-fade-in-up`}
            style={{
              pointerEvents: 'auto',
              background: 'var(--surface)',
              border: `1px solid var(--border)`,
              borderLeft: `4px solid ${
                toast.type === 'success' ? 'var(--success, #22c55e)' :
                toast.type === 'error' ? 'var(--destructive, #ef4444)' :
                toast.type === 'warning' ? 'var(--warning, #f59e0b)' :
                'var(--info, #0077B6)'
              }`,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--glass-shadow)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '300px',
              maxWidth: '400px',
            }}
          >
            <div style={{
              color: toast.type === 'success' ? 'var(--success, #22c55e)' :
                     toast.type === 'error' ? 'var(--destructive, #ef4444)' :
                     toast.type === 'warning' ? 'var(--warning, #f59e0b)' :
                     'var(--info, #0077B6)'
            }}>
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'warning' && <AlertTriangle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            
            <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
              {toast.message}
            </div>
            
            <button 
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', display: 'flex', alignItems: 'center',
                padding: '4px', borderRadius: '4px'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
