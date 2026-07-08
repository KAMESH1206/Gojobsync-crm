import { useState, useEffect } from 'react';
import { X, Clock, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeeAttendanceModal({ employee, onClose }: { employee: any, onClose: () => void }) {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employee) return;
    fetch(`/api/attendance/${employee.id}?limit=30`)
      .then(res => res.json())
      .then(data => {
        setAttendance(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [employee]);

  if (!employee) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24,
            width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{employee.name}</h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Attendance Records (Last 30 Days)</p>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}><X size={20} /></button>
          </div>

          <div style={{ padding: '1.5rem 2rem', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner" /></div>
            ) : attendance.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>No attendance records found</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {attendance.map(record => (
                  <div key={record.id} style={{ background: 'var(--background)', borderRadius: 16, padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 200 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: record.status === 'present' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: record.status === 'present' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>{record.status}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: 250 }}>
                      {record.sessions && record.sessions.length > 0 ? (
                        record.sessions.map((s: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '0.5rem', borderRadius: 8 }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)', width: 60 }}>Session {idx + 1}</div>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>Login</div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{new Date(s.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)' }}>Logout</div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.logoutTime ? new Date(s.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ display: 'flex', gap: '2rem' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Login</div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(record.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Logout</div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                          </div>
                        </div>
                      )}
                      
                      {record.totalHours > 1 && (
                        <div style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '0.25rem' }}>
                          * 1hr break deducted from effective hours
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 12, border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Effective</div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: record.is9Hours ? '#22c55e' : (record.effectiveHours > 0 ? '#f97316' : 'var(--muted)') }}>
                          {record.effectiveHours > 0 ? `${Math.floor(record.effectiveHours)}h ${Math.round((record.effectiveHours % 1) * 60)}m` : '--'}
                        </div>
                      </div>
                      {record.effectiveHours > 0 && (
                        <div title={record.is9Hours ? "Completed 9 hours shift" : "Shift incomplete"}>
                          {record.is9Hours ? <CheckCircle size={24} color="#22c55e" /> : <XCircle size={24} color="#f97316" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
