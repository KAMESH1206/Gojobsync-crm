'use client';

import { useState } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types';
import { Shield, Users, Settings, BarChart3, Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'system'>('users');
  const [search, setSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Panel</h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>User management, roles, and system configuration</p>
        </div>
        {user && (
          <span className="badge" style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.8rem' }}>
            Logged in as: <strong>{user.role}</strong> {isReadOnly ? '(Read-Only)' : '(Full Access)'}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: MOCK_USERS.length, icon: <Users size={18} />, color: '#6366f1' },
          { label: 'Active Roles', value: '10', icon: <Shield size={18} />, color: '#22c55e' },
          { label: 'Active Sessions', value: '23', icon: <BarChart3 size={18} />, color: '#f97316' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-list animate-fade-in delay-2" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
        {['users', 'roles', 'system'].map(tab => (
          <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {!isReadOnly && <button className="btn btn-primary"><Plus size={16} /> Add User</button>}
          </div>
          <div className="table-container animate-fade-in-up">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Status</th>
                  {!isReadOnly && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div className="avatar avatar-sm" style={{ background: ROLE_COLORS[u.role] }}>{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge" style={{ background: `${ROLE_COLORS[u.role]}15`, color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</span></td>
                    <td style={{ color: 'var(--muted-foreground)' }}>{u.department}</td>
                    <td style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>{u.phone}</td>
                    <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    {!isReadOnly && (
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-ghost btn-icon btn-sm"><Edit size={14} /></button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{ color: '#f87171' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {Object.entries(ROLE_LABELS).map(([role, label], i) => (
            <div key={role} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div className="avatar avatar-sm" style={{ background: ROLE_COLORS[role as keyof typeof ROLE_COLORS] }}>{label.charAt(0)}</div>
                  <span style={{ fontWeight: 600 }}>{label}</span>
                </div>
                {!isReadOnly && <button className="btn btn-ghost btn-sm"><Edit size={13} /></button>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                {MOCK_USERS.filter(u => u.role === role).length} user(s)
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'system' && (
        <div className="card animate-fade-in-up" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>System Settings</h3>
          {[
            { label: 'Email Notifications', desc: 'Send email alerts for status changes', enabled: true },
            { label: 'Auto-assign Recruiters', desc: 'Automatically assign recruiters to new requirements', enabled: false },
            { label: 'Candidate Self-Registration', desc: 'Allow candidates to register themselves', enabled: true },
            { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts', enabled: false },
            { label: 'Audit Logging', desc: 'Log all user actions for compliance', enabled: true },
          ].map(setting => (
            <div key={setting.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.125rem' }}>{setting.label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>{setting.desc}</div>
              </div>
              <button 
                className="btn-ghost" 
                disabled={isReadOnly} 
                style={{ 
                  color: setting.enabled ? 'var(--primary)' : 'var(--muted)', 
                  cursor: isReadOnly ? 'not-allowed' : 'pointer',
                  opacity: isReadOnly ? 0.6 : 1
                }}
              >
                {setting.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
