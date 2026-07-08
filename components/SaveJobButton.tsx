'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCandidateAuth } from '@/context/CandidateAuthContext';
import { Save, Bookmark } from 'lucide-react';

export default function SaveJobButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { candidate } = useCandidateAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Optionally check if already saved by fetching, but for MVP we can just toggle or let API handle it
  }, [candidate, jobId]);

  const handleSave = async () => {
    if (!candidate) { router.push('/careers/login'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/candidate-auth/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, candidateAccountId: candidate.id })
      });
      if (res.ok) {
        setSaved(true);
      } else if (res.status === 409) {
        setSaved(true); // Already saved
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to save job: ${data.error || res.statusText}`);
      }
    } catch (e: any) {
      alert(`Error saving job: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving || saved}
      style={{
        background: saved ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        color: saved ? '#38bdf8' : '#cbd5e1',
        border: `1px solid ${saved ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 12, padding: '1rem',
        fontWeight: 600, fontSize: '1rem', cursor: (saving || saved) ? 'default' : 'pointer',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8
      }}
      className={!saved && !saving ? "hover:bg-white/5 hover:border-white/20" : ""}
    >
      <Bookmark size={20} fill={saved ? '#38bdf8' : 'none'} color={saved ? '#38bdf8' : '#cbd5e1'} />
      {saved ? 'Saved' : saving ? 'Saving...' : 'Save Job'}
    </button>
  );
}
