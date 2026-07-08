'use client';

import { Code, GitBranch, Bug, Rocket, FileCode, Terminal, Cpu, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function DeveloperPage() {
  const [activeTab, setActiveTab] = useState<'api' | 'versions' | 'deployments'>('api');

  const apiEndpoints = [
    { method: 'GET', path: '/api/clients', description: 'List all clients', status: 'stable' },
    { method: 'POST', path: '/api/clients', description: 'Create a new client', status: 'stable' },
    { method: 'GET', path: '/api/requirements', description: 'List job requirements', status: 'stable' },
    { method: 'POST', path: '/api/requirements', description: 'Create requirement', status: 'stable' },
    { method: 'GET', path: '/api/candidates', description: 'List candidates', status: 'stable' },
    { method: 'POST', path: '/api/candidates', description: 'Add candidate', status: 'stable' },
    { method: 'GET', path: '/api/interviews', description: 'List interviews', status: 'beta' },
    { method: 'POST', path: '/api/interviews', description: 'Schedule interview', status: 'beta' },
    { method: 'GET', path: '/api/placements', description: 'List placements', status: 'stable' },
    { method: 'POST', path: '/api/auth/login', description: 'User authentication', status: 'stable' },
    { method: 'GET', path: '/api/reports', description: 'Generate reports', status: 'beta' },
  ];

  const METHOD_COLORS: Record<string, string> = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f97316', DELETE: '#ef4444' };

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Developer Console</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>API documentation, versioning, and deployment tools</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'API Endpoints', value: apiEndpoints.length, icon: <Code size={18} />, color: '#6366f1' },
          { label: 'Current Version', value: 'v2.1.0', icon: <GitBranch size={18} />, color: '#22c55e' },
          { label: 'Open Issues', value: '7', icon: <Bug size={18} />, color: '#f97316' },
          { label: 'Last Deploy', value: '2h ago', icon: <Rocket size={18} />, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-list animate-fade-in delay-3" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
        {['api', 'versions', 'deployments'].map(tab => (
          <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>
            {tab === 'api' ? 'API Docs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'api' && (
        <div className="card animate-fade-in-up" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 600, fontSize: '0.9375rem' }}>REST API Endpoints</h3>
            <span className="badge badge-info">Base: /api</span>
          </div>
          {apiEndpoints.map((ep, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border)', transition: 'background 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{
                padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)',
                fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                background: `${METHOD_COLORS[ep.method]}15`, color: METHOD_COLORS[ep.method],
                minWidth: 42, textAlign: 'center',
              }}>{ep.method}</span>
              <code style={{ fontSize: '0.8125rem', color: 'var(--foreground)', fontFamily: 'var(--font-mono)', flex: 1 }}>{ep.path}</code>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', flex: 2 }}>{ep.description}</span>
              <span className={`badge ${ep.status === 'stable' ? 'badge-success' : 'badge-warning'}`}>{ep.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'versions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { version: 'v2.1.0', date: 'Jul 1, 2025', changes: ['Added Reports module', 'Interview scheduling improvements', 'Bug fixes for client portal'], type: 'minor' },
            { version: 'v2.0.0', date: 'Jun 15, 2025', changes: ['Complete UI redesign', 'Dark theme', 'Role-based dashboards', 'New placement pipeline'], type: 'major' },
            { version: 'v1.5.2', date: 'May 20, 2025', changes: ['Performance improvements', 'Fixed candidate search', 'Updated dependencies'], type: 'patch' },
          ].map((v, i) => (
            <div key={v.version} className={`card animate-fade-in-up delay-${i + 1}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <GitBranch size={16} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontWeight: 600 }}>{v.version}</h3>
                  <span className={`badge ${v.type === 'major' ? 'badge-primary' : v.type === 'minor' ? 'badge-info' : 'badge-neutral'}`}>{v.type}</span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{v.date}</span>
              </div>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {v.changes.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'deployments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { env: 'Production', version: 'v2.1.0', status: 'healthy', time: '2 hours ago', url: 'crm.production.com' },
            { env: 'Staging', version: 'v2.2.0-beta', status: 'deploying', time: '5 min ago', url: 'crm.staging.com' },
            { env: 'Development', version: 'v2.2.0-dev', status: 'healthy', time: '30 min ago', url: 'crm.dev.com' },
          ].map((d, i) => (
            <div key={d.env} className={`card animate-fade-in-up delay-${i + 1}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: d.status === 'healthy' ? '#22c55e' : '#eab308',
                    boxShadow: `0 0 8px ${d.status === 'healthy' ? '#22c55e' : '#eab308'}`,
                  }} />
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{d.env}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{d.url}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{d.version}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={10} /> {d.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
