'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Eye, EyeOff, Building2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token,
          newPassword: form.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
        <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-6">
          Invalid or missing reset link.
        </div>
        <p className="text-sky-200/70 text-sm mb-6">Please request a new password reset link from the login page.</p>
        <Link href="/" className="btn btn-primary w-full">Return Home</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Password Reset Successfully!</h2>
        <p className="text-sky-200/70 text-sm mb-8">Your password has been changed successfully. You can now login with your new password.</p>
        
        <div className="flex flex-col gap-3">
          <Link href="/careers/login" className="w-full py-3 bg-[#0077B6] hover:bg-[#00B4D8] text-white font-bold rounded-xl transition-colors">
            Go to Candidate Login
          </Link>
          <Link href="/employer/login" className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors">
            Go to Company Login
          </Link>
          <Link href="/crm" className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
      <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Set New Password</h1>
      <p className="text-sky-200/70 text-sm mb-7">Create a new, strong password for {email}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type={showPw1 ? 'text' : 'password'}
            placeholder="New Password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full pl-11 pr-11 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
          />
          <button type="button" onClick={() => setShowPw1(!showPw1)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            {showPw1 ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type={showPw2 ? 'text' : 'password'}
            placeholder="Confirm New Password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full pl-11 pr-11 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#00B4D8] transition-colors"
          />
          <button type="button" onClick={() => setShowPw2(!showPw2)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:opacity-90 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Reset Password <ArrowRight size={18} /></>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f44] via-[#0f2d6b] to-[#0a1f44] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full opacity-20 -top-20 -left-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)' }} />
      <div className="absolute w-80 h-80 rounded-full opacity-20 -bottom-10 -right-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-extrabold text-xl leading-none">The jobsync</div>
              <div className="text-sky-300 text-xs font-medium">Account Recovery</div>
            </div>
          </Link>
        </div>

        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
