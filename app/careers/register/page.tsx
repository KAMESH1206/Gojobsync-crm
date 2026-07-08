'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Zap, Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CandidateRegisterPage() {
  const router = useRouter();
  const { login } = useCandidateAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);

    try {
      const res = await fetch('/api/candidate-auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }

      // Auto login after register
      const loginResult = await login(form.email, form.password);
      if (loginResult.success) {
        setStep(2);
        setTimeout(() => router.push('/careers/profile'), 2000);
      }
    } catch { setError('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  if (step === 2) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '3rem', textAlign: 'center', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
          <CheckCircle size={40} color="white" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.5px' }}>Welcome to JobSync! 🎉</h2>
        <p style={{ color: '#94a3b8' }}>Redirecting to your profile dashboard...</p>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(0,0,0,0) 70%)', top: -100, left: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', bottom: -50, right: -50, pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', position: 'relative', zIndex: 1 }}>
        <Link href="/careers" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '2.5rem' }}>
          <img src="/logooo.jpeg" alt="JobSync Logo" style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: '50%' }} />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'white', letterSpacing: '-0.5px' }}>The Job<span style={{ color: '#38bdf8' }}>Sync</span></span>
        </Link>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.5px' }}>Create an account</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>Level up your career with AI job matching.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: <User size={18} />, field: 'name', placeholder: 'Full Name', type: 'text' },
            { icon: <Mail size={18} />, field: 'email', placeholder: 'Email Address', type: 'email' },
            { icon: <Phone size={18} />, field: 'phone', placeholder: 'Mobile Number', type: 'tel' },
          ].map(({ icon, field, placeholder, type }) => (
            <div key={field} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>{icon}</div>
              <input
                required type={type} placeholder={placeholder}
                value={(form as any)[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: 12, padding: '0.8rem 0.8rem 0.8rem 2.8rem', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                className="focus:border-sky-500 placeholder-slate-500"
              />
            </div>
          ))}

          {[
            { field: 'password', placeholder: 'Password (min 6 chars)' },
            { field: 'confirmPassword', placeholder: 'Confirm Password' },
          ].map(({ field, placeholder }) => (
            <div key={field} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}><Lock size={18} /></div>
              <input
                required type={showPw ? 'text' : 'password'} placeholder={placeholder}
                value={(form as any)[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width: '100%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: 12, padding: '0.8rem 2.8rem', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                className="focus:border-sky-500 placeholder-slate-500"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ))}

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10, padding: '0.75rem', color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: 'white', border: 'none', borderRadius: 12, padding: '0.875rem', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: '0.5rem', transition: 'all 0.2s' }} className="hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
            {loading ? 'Creating Account...' : <><span>Join JobSync</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/careers/login" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }} className="hover:text-sky-300">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
