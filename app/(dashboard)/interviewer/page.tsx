'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Calendar, Clock, Star } from 'lucide-react';

export default function InterviewerPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState<any | null>(null);

  const fetchAssignedCandidates = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/candidates?assignedInterviewerId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        // Only show active candidates that need interviewing (Interested)
        setCandidates(data.filter((c: any) => c.status === 'Interested'));
      }
    } catch {
      toast.error('Failed to load assigned candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedCandidates();
  }, [user]);

  const submitFeedback = async (status: 'selected' | 'rejected', notes: string) => {
    if (!feedbackModal) return;
    try {
      // First update candidate status
      const res = await fetch(`/api/candidates/${feedbackModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      
      if (res.ok) {
        toast.success(`Candidate marked as ${status}`);
        setFeedbackModal(null);
        fetchAssignedCandidates();
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch {
      toast.error('Error submitting feedback');
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><div className="spinner" style={{width: 40, height: 40}} /></div>;

  return (
    <div>
      <div className="animate-fade-in mb-6">
        <h1 className="text-2xl font-bold">Interviewer Hub</h1>
        <p className="text-[var(--muted-foreground)]">Conduct interviews and submit final feedback</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {candidates.map((candidate, i) => (
          <div key={candidate.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 6)}`} style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex gap-4 items-center">
                <div className="avatar avatar-lg" style={{ background: `hsl(${candidate.name.charCodeAt(0) * 15}, 55%, 45%)`, borderRadius: 12 }}>
                  {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{candidate.email} • {candidate.phone}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="badge badge-info">{candidate.experience}</span>
                    <span className="badge badge-neutral">{candidate.education}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-w-[200px]">
                <button onClick={() => setFeedbackModal(candidate)} className="btn-primary w-full">
                  Submit Feedback
                </button>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Skills:</strong> {JSON.parse(candidate.skills || '[]').join(', ')}</p>
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)]">No pending interviews assigned to you currently.</div>
        )}
      </div>

      {feedbackModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={() => setFeedbackModal(null)}>
          <div className="card w-full max-w-lg p-6 animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Interview Feedback for {feedbackModal.name}</h2>
            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">Interview Notes & Feedback</label>
                <textarea id="feedback-notes" className="form-input" rows={4} placeholder="Detailed technical and cultural feedback..." />
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => {
                    const el = document.getElementById('feedback-notes') as HTMLTextAreaElement;
                    submitFeedback('rejected', el.value);
                  }} 
                  className="btn-secondary w-full text-red-500 hover:bg-red-500/10"
                >
                  <XCircle size={16} /> Reject
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('feedback-notes') as HTMLTextAreaElement;
                    submitFeedback('selected', el.value);
                  }} 
                  className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle size={16} /> Select (Pass to Placement)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
