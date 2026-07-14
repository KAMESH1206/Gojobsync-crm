'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Zap, Eye, EyeOff, Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function CandidateLoginPage() {
  const router = useRouter();
  const { login } = useCandidateAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    if (result.success) {
      router.push('/careers');
    } else {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      
      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-6 right-6 p-2 rounded-full bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors z-10 shadow-sm"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }} 
        className="glass p-10 w-full max-w-[420px] relative z-10 m-4"
      >
        <Link href="/careers" className="flex items-center gap-3 no-underline mb-10">
          <img src="/loooo.jpeg" alt="The Job Sync Logo" className="h-9 w-9 object-contain rounded-full" />
          <span className="font-extrabold text-xl text-[var(--foreground)] tracking-tight">
            The Job<span className="text-[var(--primary)]">Sync</span>
          </span>
        </Link>

        <h1 className="text-2xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">Welcome back</h1>
        <p className="text-[var(--muted-foreground)] text-sm mb-8">Sign in to access your AI job recommendations</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] flex items-center justify-center pointer-events-none">
              <Mail size={18} />
            </div>
            <input 
              required 
              type="email" 
              placeholder="Email Address" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="input py-3 h-auto rounded-xl"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] flex items-center justify-center pointer-events-none">
              <Lock size={18} />
            </div>
            <input 
              required 
              type={showPw ? 'text' : 'password'} 
              placeholder="Password" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="input py-3 h-auto rounded-xl"
              style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)] p-0 transition-colors flex items-center justify-center"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg p-3 text-[var(--danger)] text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary py-3.5 mt-2 rounded-xl text-base w-full"
          >
            {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-7 text-[var(--muted-foreground)] text-sm">
          Don't have an account?{' '}
          <Link href="/careers/register" className="text-[var(--primary)] font-bold no-underline hover:text-[var(--primary-hover)] transition-colors">
            Join The Job Sync
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
