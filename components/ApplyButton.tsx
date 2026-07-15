'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { CheckCircle, Zap } from 'lucide-react';

export default function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { candidate, appliedJobs, applyToJob, requireCompleteProfile } = useCandidateAuth();
  const [applying, setApplying] = useState(false);
  const applied = appliedJobs?.has(jobId) || false;

  const handleApply = async () => {
    if (!candidate) { router.push('/careers/login'); return; }
    
    requireCompleteProfile(async () => {
      setApplying(true);
      await applyToJob(jobId);
      setApplying(false);
    });
  };

  if (applied) {
    return (
      <div style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 12, padding: '1rem 2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem' }}>
        <CheckCircle size={20} /> Applied Successfully
      </div>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={applying}
      style={{
        background: applying ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #0077B6, #00B4D8)',
        color: applying ? '#94a3b8' : 'white',
        border: 'none', borderRadius: 12, padding: '1rem 2.5rem',
        fontWeight: 800, fontSize: '1.05rem', cursor: applying ? 'wait' : 'pointer',
        transition: 'all 0.2s', boxShadow: applying ? 'none' : '0 10px 20px rgba(14,165,233,0.3)',
        display: 'flex', alignItems: 'center', gap: 10
      }}
      className={!applying ? "hover:scale-105 hover:shadow-[0_15px_30px_rgba(14,165,233,0.4)]" : ""}
    >
      <Zap size={20} /> {applying ? 'Sending...' : 'Apply Now'}
    </button>
  );
}
