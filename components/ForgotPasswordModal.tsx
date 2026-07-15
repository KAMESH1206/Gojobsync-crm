'use client';

import { useState } from 'react';
import { Mail, ArrowRight, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'user' | 'candidate' | 'employer';
}

export default function ForgotPasswordModal({ isOpen, onClose, role }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--card)] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)] relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Check Your Email</h2>
                <p className="text-[var(--muted-foreground)] text-sm mb-6">
                  If an account exists for {email}, we have sent a password reset link.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Reset Password</h2>
                <p className="text-[var(--muted-foreground)] text-sm mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted)] text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send Reset Link <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
