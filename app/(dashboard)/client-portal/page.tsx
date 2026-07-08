'use client';

import { useState } from 'react';
import { MOCK_REQUIREMENTS, MOCK_CANDIDATES } from '@/lib/mock-data';
import { STATUS_COLORS } from '@/lib/types';
import { Building2, Plus, Briefcase, Users, Clock, CheckCircle, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState<'requirements' | 'candidates' | 'new-request'>('requirements');
  const clientRequirements = MOCK_REQUIREMENTS.filter(r => r.clientId === 'c1');
  const relatedCandidates = MOCK_CANDIDATES.filter(c => clientRequirements.some(r => r.id === c.appliedFor));

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Client Portal</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Manage your manpower requirements and track progress</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Active Requirements', value: clientRequirements.filter(r => r.status !== 'closed').length, icon: <Briefcase size={18} />, color: '#3b82f6' },
          { label: 'Candidates in Pipeline', value: relatedCandidates.length, icon: <Users size={18} />, color: '#22c55e' },
          { label: 'Positions Filled', value: clientRequirements.reduce((acc, r) => acc + r.filledPositions, 0), icon: <CheckCircle size={18} />, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-list animate-fade-in delay-3" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
        {['requirements', 'candidates', 'new-request'].map(tab => (
          <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>
            {tab === 'new-request' ? '+ New Request' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'requirements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {clientRequirements.map((req, i) => (
            <div key={req.id} className={`card animate-fade-in-up delay-${i + 1}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{req.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge" style={{ background: `${STATUS_COLORS[req.status]}15`, color: STATUS_COLORS[req.status] }}>{req.status.replace('_', ' ')}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{req.location} • {req.experience}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-hover)' }}>{req.filledPositions}/{req.positions}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>Positions Filled</div>
                </div>
              </div>
              <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
                <div className="progress-fill" style={{ width: `${(req.filledPositions / req.positions) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="table-container animate-fade-in-up">
          <table className="table">
            <thead><tr><th>Candidate</th><th>Position</th><th>Experience</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {relatedCandidates.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td>{c.currentRole}</td>
                  <td>{c.experience}</td>
                  <td><span className="badge" style={{ background: `${STATUS_COLORS[c.status]}15`, color: STATUS_COLORS[c.status] }}>{c.status.replace(/_/g, ' ')}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn-ghost btn-sm"><Eye size={14} /> View</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#4ade80' }}><ThumbsUp size={14} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }}><ThumbsDown size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'new-request' && (
        <div className="card animate-fade-in-up" style={{ padding: '1.5rem', maxWidth: 600 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Raise Manpower Request</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div><label className="label">Position Title</label><input className="input" placeholder="e.g., Senior Java Developer" /></div>
            <div><label className="label">Job Description</label><textarea className="textarea" rows={4} placeholder="Describe the role requirements..." /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><label className="label">Number of Positions</label><input className="input" type="number" placeholder="3" /></div>
              <div><label className="label">Experience Required</label><input className="input" placeholder="3-5 years" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><label className="label">Location</label><input className="input" placeholder="Bangalore" /></div>
              <div><label className="label">Budget / Salary Range</label><input className="input" placeholder="₹15-20 LPA" /></div>
            </div>
            <div><label className="label">Required Skills</label><input className="input" placeholder="Java, Spring Boot, AWS" /></div>
            <div><label className="label">Deadline</label><input className="input" type="date" /></div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Submit Request</button>
          </div>
        </div>
      )}
    </div>
  );
}
