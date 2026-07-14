'use client';

import { useState, useEffect } from 'react';
import { X, Briefcase, MapPin, Building2, DollarSign, Star, CheckCircle } from 'lucide-react';
import { usePortalTheme } from '@/context/PortalThemeContext';

export default function CompleteProfileModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  candidate
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: (updatedData: any) => void;
  candidate: any;
}) {
  const { isDark } = usePortalTheme();
  
  const [form, setForm] = useState({
    location: '',
    currentCompany: '',
    currentRole: '',
    expectedSalary: '',
    experience: '',
    skills: ''
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (candidate) {
      // Parse skills to comma separated string if it's JSON
      let parsedSkills = '';
      try {
        const arr = JSON.parse(candidate.skills || '[]');
        if (Array.isArray(arr)) parsedSkills = arr.join(', ');
      } catch {
        parsedSkills = candidate.skills || '';
      }

      // Parse experience to get years or latest role
      let parsedExp = '';
      try {
        const arr = JSON.parse(candidate.experience || '[]');
        if (Array.isArray(arr) && arr.length > 0 && arr[0].role) {
          parsedExp = arr[0].role;
        }
      } catch {
        parsedExp = candidate.experience || '';
      }

      setForm({
        location: candidate.location || '',
        currentCompany: candidate.currentCompany || '',
        currentRole: candidate.currentRole || '',
        expectedSalary: candidate.expectedSalary || '',
        experience: parsedExp,
        skills: parsedSkills
      });
    }
  }, [candidate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convert skills back to JSON array
      const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      
      // Structure experience as a JSON array with one item to match the rest of the app's structure
      const experienceJson = JSON.stringify([{
        company: form.currentCompany,
        role: form.currentRole || form.experience,
        from: '',
        to: 'Present',
        current: true
      }]);

      const payload = {
        id: candidate?.id,
        location: form.location,
        currentCompany: form.currentCompany,
        currentRole: form.currentRole,
        expectedSalary: form.expectedSalary,
        experience: experienceJson,
        skills: JSON.stringify(skillsArr),
      };

      const res = await fetch('/api/candidate-auth/profile', {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const updated = await res.json();
        onSuccess(updated);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    background: isDark ? 'rgba(0,0,0,0.2)' : 'white',
    color: isDark ? 'white' : '#0f172a',
    fontSize: '0.95rem',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: isDark ? '#94a3b8' : '#475569',
    marginBottom: '0.5rem'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      padding: '1rem'
    }}>
      <div 
        style={{
          background: isDark ? '#0f172a' : '#ffffff',
          borderRadius: 24, width: '100%', maxWidth: 500,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? 'white' : '#0f172a', marginBottom: 4 }}>Complete Your Profile</h2>
            <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b' }}>Please provide these details to apply.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          <form id="complete-profile-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label style={labelStyle}>Location *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input required style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Chennai, India" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Current Company</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={form.currentCompany} onChange={e => setForm({...form, currentCompany: e.target.value})} placeholder="e.g. Startup Inc." />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Current Role / Title *</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input required style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={form.currentRole} onChange={e => setForm({...form, currentRole: e.target.value})} placeholder="e.g. Software Developer" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Expected Salary</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={form.expectedSalary} onChange={e => setForm({...form, expectedSalary: e.target.value})} placeholder="e.g. 10 LPA" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Skills (Comma separated) *</label>
              <div style={{ position: 'relative' }}>
                <Star size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '12px' }} />
                <textarea required style={{ ...inputStyle, paddingLeft: '2.5rem', minHeight: 80, resize: 'vertical' }} value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Node.js, Typescript..." />
              </div>
            </div>

          </form>
        </div>

        <div style={{ padding: '1.5rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: 12, border: 'none', background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit" form="complete-profile-form" disabled={saving} style={{ padding: '0.75rem 2rem', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: 'white', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(14,165,233,0.3)' }}>
            {saving ? 'Saving...' : <><CheckCircle size={18} /> Save & Apply</>}
          </button>
        </div>

      </div>
    </div>
  );
}
