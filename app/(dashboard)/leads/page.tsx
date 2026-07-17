'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PhoneCall, Loader2, Building2 } from 'lucide-react';
import type { CompanyLead } from '@/lib/types';

export default function LeadsAdminDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return <div className="p-8">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Consolidated Leads (DMS & Coordinator)</h1>
        <p className="text-[var(--muted-foreground)]">Track daily additions and updates</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--primary)]" size={32} /></div>
      ) : leads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-[var(--border)]">
          <Building2 size={48} className="mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No leads exist yet</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[var(--border)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--sidebar-bg)]">
                <th className="p-4 font-semibold text-sm">Company Name</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm">Added By (DMS)</th>
                <th className="p-4 font-semibold text-sm">Handled By (Coordinator)</th>
                <th className="p-4 font-semibold text-sm">Contact Info</th>
                <th className="p-4 font-semibold text-sm">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-[var(--border)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-[var(--foreground)]">{lead.companyName}</div>
                    {lead.contactPerson && <div className="text-xs text-[var(--muted-foreground)] mt-1">{lead.contactPerson} ({lead.position})</div>}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
                      lead.status === 'fresh' ? 'bg-purple-100 text-purple-700' :
                      lead.status === 'interested' || lead.status === 'updated' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>{lead.status.replace('_', ' ')}</span>
                    {lead.remark && <div className="text-xs text-[var(--muted-foreground)] mt-1 truncate max-w-[150px]" title={lead.remark}>{lead.remark}</div>}
                  </td>
                  <td className="p-4 font-medium text-sm text-[var(--primary)]">{lead.dms?.name || 'Unknown'}</td>
                  <td className="p-4 font-medium text-sm text-[var(--primary)]">{lead.coordinator?.name || 'Unassigned'}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-xs">
                    <div>{lead.phone || '-'}</div>
                    <div>{lead.email || '-'}</div>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)] text-sm">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
