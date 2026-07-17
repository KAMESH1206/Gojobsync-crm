'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Building2, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import type { CompanyLead } from '@/lib/types';

export default function DMSDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ companyName: '', email: '', phone: '' });
        setShowForm(false);
        fetchLeads();
      } else {
        alert('Failed to add client');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || !['super_admin', 'admin', 'dms'].includes(user.role)) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Company Client (DMS)</h1>
          <p className="text-[var(--muted-foreground)]">Add fresh company dumps to distribute to coordinators</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Client
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Add Client (Fresh Dump)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Company Name *</label>
                <input required className="form-input" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="form-label">Email ID</label>
                <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="If none, leave blank or type 'na'" />
              </div>
              <div>
                <label className="form-label">Phone No</label>
                <input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="If none, leave blank or type 'na'" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--primary)]" size={32} /></div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-[var(--border)]">
          <Building2 size={48} className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No clients added yet</h3>
          <p className="text-[var(--muted-foreground)] mb-6">Start adding fresh company dumps to auto-assign them.</p>
          <button className="btn btn-primary mx-auto" onClick={() => setShowForm(true)}><Plus size={18} /> Add First Client</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sidebar-bg)]">
                <th className="p-4 font-semibold text-sm">Company Name</th>
                <th className="p-4 font-semibold text-sm">Email</th>
                <th className="p-4 font-semibold text-sm">Phone</th>
                <th className="p-4 font-semibold text-sm">Assigned To</th>
                <th className="p-4 font-semibold text-sm">Added On</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-[var(--border)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-[var(--foreground)]">{lead.companyName}</div>
                    <div className="text-xs text-[var(--muted-foreground)] uppercase mt-1">{lead.status.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{lead.email || 'na'}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{lead.phone || 'na'}</td>
                  <td className="p-4 text-sm font-medium">{lead.coordinator?.name || 'Unassigned'}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
