'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Database, Clock, Briefcase, Mail, Phone, MapPin } from 'lucide-react';

export default function FreshDumpPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFreshDump = async () => {
    try {
      // Fetch only "new" candidates
      const res = await fetch('/api/candidates?status=new');
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch {
      toast.error('Failed to load fresh dump');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshDump();
  }, [user]);

  if (loading) return <div className="p-10 flex justify-center"><div className="spinner" style={{width: 40, height: 40}} /></div>;

  // Group candidates by Date
  const grouped = candidates.reduce((acc: any, c: any) => {
    const d = new Date(c.createdAt);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div className="animate-fade-in mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--foreground)]">
          <Database size={24} className="text-indigo-500" />
          Fresh Dump
        </h1>
        <p className="text-[var(--muted-foreground)]">Day-to-day new applications waiting for HR review</p>
      </div>

      <div className="animate-fade-in-up space-y-10">
        {sortedDates.length === 0 ? (
          <div className="text-center p-12 card border border-[var(--border)]">
            <Database size={48} className="mx-auto mb-4 text-[var(--muted)] opacity-50" />
            <h3 className="text-lg font-bold">No fresh candidates</h3>
            <p className="text-[var(--muted-foreground)]">All candidates have been reviewed or none have applied recently.</p>
          </div>
        ) : (
          sortedDates.map(dateStr => (
            <div key={dateStr}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--foreground)] border-b border-[var(--border)] pb-2">
                <Clock size={18} className="text-[var(--muted-foreground)]" />
                {getDateLabel(dateStr)}
                <span className="badge badge-primary ml-2">{grouped[dateStr].length}</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[dateStr].map((c: any) => (
                  <div key={c.id} className="card p-5 border border-[var(--border)] flex flex-col hover:border-indigo-500/30 transition-colors">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                        {c.name[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-[var(--foreground)] truncate">{c.name}</h3>
                        <p className="text-sm text-[var(--muted-foreground)] truncate">{c.currentRole || 'Candidate'}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Briefcase size={14} className="shrink-0" />
                        <span className="truncate">{c.requirementTitle || 'General Application'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Phone size={14} className="shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{c.location || 'Unknown Location'}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)] flex justify-between items-center">
                      <span>Applied at {new Date(c.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                      <span className="badge badge-neutral bg-blue-50 text-blue-600 border-blue-200">New</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
