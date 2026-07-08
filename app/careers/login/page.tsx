'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Zap, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateLoginPage() {
  const router = useRouter();
  const { login } = useCandidateAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', top: -50, left: -50, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(0,0,0,0) 70%)', bottom: -100, right: -100, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 420, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', position: 'relative', zIndex: 1 }}>
        <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '2.5rem' }}>
          <img src="/logooo.jpeg" alt="JobSync Logo" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%' }} />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.5px' }}>The Job<span style={{ color: '#38bdf8' }}>Sync</span></span>
        </Link>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>Welcome back</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>Sign in to access your AI job recommendations</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}><Mail size={18} /></div>
            <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: 12, padding: '0.8rem 0.8rem 0.8rem 2.8rem', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              className="focus:border-sky-500 placeholder-slate-500" />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}><Lock size={18} /></div>
            <input required type={showPw ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: 12, padding: '0.8rem 2.8rem', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              className="focus:border-sky-500 placeholder-slate-500" />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10, padding: '0.75rem', color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: 'white', border: 'none', borderRadius: 12, padding: '0.875rem', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: '0.5rem', transition: 'all 0.2s' }} className="hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
            {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Don't have an account? <Link href="/careers/register" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }} className="hover:text-sky-300">Join JobSync</Link>
        </p>
      </motion.div>
    </div>
  );
}
