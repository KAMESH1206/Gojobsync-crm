'use client';

import { useState } from 'react';
import { TestTube2, CheckCircle, XCircle, Clock, AlertTriangle, Bug, FileText, Play, Filter } from 'lucide-react';

const MOCK_TEST_CASES = [
  { id: 'TC001', title: 'Login with valid credentials', module: 'Authentication', type: 'Functional', status: 'passed', priority: 'high' },
  { id: 'TC002', title: 'Login with invalid password', module: 'Authentication', type: 'Functional', status: 'passed', priority: 'high' },
  { id: 'TC003', title: 'Add new client form validation', module: 'Clients', type: 'UI', status: 'passed', priority: 'medium' },
  { id: 'TC004', title: 'Create job requirement', module: 'Requirements', type: 'Functional', status: 'failed', priority: 'high' },
  { id: 'TC005', title: 'Search candidates by skill', module: 'Candidates', type: 'Functional', status: 'passed', priority: 'medium' },
  { id: 'TC006', title: 'Schedule interview API', module: 'Interviews', type: 'API', status: 'pending', priority: 'high' },
  { id: 'TC007', title: 'Placement pipeline flow', module: 'Placements', type: 'Functional', status: 'passed', priority: 'high' },
  { id: 'TC008', title: 'Dashboard charts rendering', module: 'Dashboard', type: 'UI', status: 'passed', priority: 'low' },
  { id: 'TC009', title: 'Role-based sidebar navigation', module: 'Navigation', type: 'UI', status: 'failed', priority: 'medium' },
  { id: 'TC010', title: 'Reports export functionality', module: 'Reports', type: 'Functional', status: 'pending', priority: 'medium' },
  { id: 'TC011', title: 'Responsive layout on mobile', module: 'UI', type: 'UI', status: 'passed', priority: 'high' },
  { id: 'TC012', title: 'Notification dropdown', module: 'Notifications', type: 'UI', status: 'passed', priority: 'low' },
];

const MOCK_BUGS = [
  { id: 'BUG-001', title: 'Requirement form resets on validation error', severity: 'high', module: 'Requirements', status: 'open', assignee: 'Rahul Verma' },
  { id: 'BUG-002', title: 'Sidebar active indicator misaligned', severity: 'low', module: 'Navigation', status: 'open', assignee: 'Rahul Verma' },
  { id: 'BUG-003', title: 'Interview reschedule not reflecting', severity: 'medium', module: 'Interviews', status: 'in_progress', assignee: 'Rahul Verma' },
  { id: 'BUG-004', title: 'CSV export missing headers', severity: 'medium', module: 'Reports', status: 'resolved', assignee: 'Rahul Verma' },
];

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState<'cases' | 'bugs' | 'reports'>('cases');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const passed = MOCK_TEST_CASES.filter(t => t.status === 'passed').length;
  const failed = MOCK_TEST_CASES.filter(t => t.status === 'failed').length;
  const pending = MOCK_TEST_CASES.filter(t => t.status === 'pending').length;
  const passRate = Math.round((passed / MOCK_TEST_CASES.length) * 100);

  const STATUS_ICON: Record<string, React.ReactNode> = {
    passed: <CheckCircle size={14} style={{ color: '#22c55e' }} />,
    failed: <XCircle size={14} style={{ color: '#ef4444' }} />,
    pending: <Clock size={14} style={{ color: '#eab308' }} />,
  };

  return (
    <div>
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Testing Dashboard</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Test case management, bug tracking, and reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Tests', value: MOCK_TEST_CASES.length, icon: <TestTube2 size={18} />, color: '#0077B6' },
          { label: 'Passed', value: passed, icon: <CheckCircle size={18} />, color: '#22c55e' },
          { label: 'Failed', value: failed, icon: <XCircle size={18} />, color: '#ef4444' },
          { label: 'Pending', value: pending, icon: <Clock size={18} />, color: '#eab308' },
          { label: 'Pass Rate', value: `${passRate}%`, icon: <FileText size={18} />, color: '#0077B6' },
          { label: 'Open Bugs', value: MOCK_BUGS.filter(b => b.status === 'open').length, icon: <Bug size={18} />, color: '#f97316' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in-up delay-${i + 1}`}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.375rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tab-list animate-fade-in delay-3" style={{ marginBottom: '1.25rem', width: 'fit-content' }}>
        {['cases', 'bugs', 'reports'].map(tab => (
          <button key={tab} className={`tab-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>
            {tab === 'cases' ? 'Test Cases' : tab === 'bugs' ? 'Bug Tracker' : 'Reports'}
          </button>
        ))}
      </div>

      {activeTab === 'cases' && (
        <div className="table-container animate-fade-in-up">
          <table className="table">
            <thead><tr><th>ID</th><th>Test Case</th><th>Module</th><th>Type</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {MOCK_TEST_CASES.map(tc => (
                <tr key={tc.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{tc.id}</td>
                  <td style={{ fontWeight: 500 }}>{tc.title}</td>
                  <td><span className="badge badge-neutral">{tc.module}</span></td>
                  <td><span className="badge badge-info">{tc.type}</span></td>
                  <td><span className={`badge ${tc.priority === 'high' ? 'badge-danger' : tc.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{tc.priority}</span></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>{STATUS_ICON[tc.status]} <span style={{ textTransform: 'capitalize' }}>{tc.status}</span></div></td>
                  <td><button className="btn btn-ghost btn-sm"><Play size={13} /> Run</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'bugs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {MOCK_BUGS.map((bug, i) => (
            <div key={bug.id} className={`card animate-fade-in-up delay-${i + 1}`} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{bug.id}</span>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{bug.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-neutral">{bug.module}</span>
                    <span className={`badge ${bug.severity === 'high' ? 'badge-danger' : bug.severity === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{bug.severity}</span>
                    <span className={`badge ${bug.status === 'open' ? 'badge-danger' : bug.status === 'in_progress' ? 'badge-info' : 'badge-success'}`}>{bug.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>→ {bug.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card animate-fade-in-up" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Test Summary Report</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Passed', count: passed, total: MOCK_TEST_CASES.length, color: '#22c55e' },
              { label: 'Failed', count: failed, total: MOCK_TEST_CASES.length, color: '#ef4444' },
              { label: 'Pending', count: pending, total: MOCK_TEST_CASES.length, color: '#eab308' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.count} / {item.total}</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div style={{ width: `${(item.count / item.total) * 100}%`, height: '100%', borderRadius: 'var(--radius-full)', background: item.color, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }}><FileText size={14} /> Download Report</button>
        </div>
      )}
    </div>
  );
}
