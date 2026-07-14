'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEmployerAuth } from '@/context/EmployerAuthContext';
import {
  Search, Filter, Download, Briefcase, MapPin, Building2,
  ChevronLeft, ChevronRight, User, X, Bookmark
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string | null;
  skills: string;
  experience: string | null;
  education: string | null;
  location: string | null;
  currentCompany: string | null;
  currentRole: string | null;
  expectedSalary: string | null;
  preferredRoles: string | null;
  createdAt: string;
  isSaved?: boolean;
}

const FIELDS = [
  'Information Technology', 'Software', 'Supply Chain & Logistics', 'Finance',
  'Healthcare', 'HR & Administration', 'Manufacturing', 'Marketing', 'Sales'
];

export default function EmployerCandidatesPage() {
  const router = useRouter();
  const { employer, isLoading } = useEmployerAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [fetching, setFetching] = useState(true);

  const [search, setSearch] = useState('');
  const [field, setField] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    if (!isLoading && !employer) {
      router.push('/employer/login');
    }
  }, [employer, isLoading, router]);

  const fetchCandidates = useCallback(async () => {
    setFetching(true);
    try {
      const query = new URLSearchParams({ search, field, location, page: page.toString() });
      const res = await fetch(`/api/employer/candidates?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
        setTotalCandidates(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    }
    setFetching(false);
  }, [search, field, location, page]);

  const handleToggleSave = async (id: string, currentlySaved: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setCandidates(cands => cands.map(c => c.id === id ? { ...c, isSaved: !currentlySaved } : c));
      await fetch('/api/employer/candidates/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: id, action: currentlySaved ? 'unsave' : 'save' })
      });
    } catch (err) {
      setCandidates(cands => cands.map(c => c.id === id ? { ...c, isSaved: currentlySaved } : c));
    }
  };

  useEffect(() => {
    if (!employer) return;
    const timer = setTimeout(() => { fetchCandidates(); }, 400);
    return () => clearTimeout(timer);
  }, [fetchCandidates, employer]);

  const handleExportExcel = () => {
    try {
      const formattedData = candidates.map(c => {
        let skillsArr: string[] = [];
        try { skillsArr = JSON.parse(c.skills); } catch { skillsArr = []; }
        return {
          'Candidate Name': c.name,
          'Email': c.email,
          'Phone': c.phone,
          'Headline': c.headline || '-',
          'Skills': Array.isArray(skillsArr) ? skillsArr.join(', ') : c.skills,
          'Experience': c.experience || '-',
          'Current Company': c.currentCompany || '-',
          'Current Role': c.currentRole || '-',
          'Location': c.location || '-',
          'Preferred Roles / Field': c.preferredRoles || '-',
          'Expected Salary': c.expectedSalary || '-',
          'Registered On': new Date(c.createdAt).toLocaleDateString(),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

      worksheet['!cols'] = [
        { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 40 },
        { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }
      ];

      XLSX.writeFile(workbook, `Candidates_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export data');
    }
  };

  if (isLoading || !employer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = employer.companyName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/loooo.jpeg" alt="The Job Sync Logo" className="h-9 w-9 object-contain rounded-full border border-gray-200" />
            <div>
              <div className="font-extrabold text-slate-900 text-sm leading-none">The Job Sync</div>
              <div className="text-sky-600 text-[10px] font-semibold mt-0.5 uppercase tracking-wider">Employer Portal</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/employer/dashboard" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
              Dashboard
            </Link>
            <span className="px-4 py-2 text-sm font-semibold text-sky-600 bg-sky-50 rounded-lg flex items-center gap-1.5">
              <Search size={14} /> Candidates
            </span>
          </nav>
          <div className="w-20 hidden md:block" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Candidate Database</h1>
            <p className="text-slate-500 text-sm mt-1">Search and filter to find the perfect fit for your roles.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors text-sm ${
                showSavedOnly ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark size={16} className={showSavedOnly ? "fill-sky-700" : ""} />
              {showSavedOnly ? "Showing Saved" : "Show Saved"}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={candidates.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition-colors text-sm w-fit disabled:opacity-50"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, skills, role..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={field}
              onChange={(e) => { setField(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-all bg-slate-50 focus:bg-white appearance-none"
            >
              <option value="">All Fields / Domains</option>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Location (e.g. Chennai)"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm font-medium text-slate-500">
          Found <strong className="text-slate-900">{totalCandidates}</strong> candidates
        </div>

        {/* Candidate List */}
        {fetching ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Searching candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No candidates found</h3>
            <p className="text-slate-500 max-w-sm">Try adjusting your search filters or removing the location filter.</p>
            <button
              onClick={() => { setSearch(''); setField(''); setLocation(''); setShowSavedOnly(false); }}
              className="mt-4 text-sky-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {candidates.filter(c => showSavedOnly ? c.isSaved : true).map((candidate) => {
              let skillsArr: string[] = [];
              try { skillsArr = JSON.parse(candidate.skills); } catch { skillsArr = []; }

              // Fix for JSON in experience field
              let parsedExp = candidate.experience;
              if (parsedExp && parsedExp.startsWith('[')) {
                try {
                  const expArr = JSON.parse(parsedExp);
                  if (Array.isArray(expArr) && expArr.length > 0 && expArr[0].role) {
                    parsedExp = `${expArr[0].role} at ${expArr[0].company || 'Unknown'}`;
                  }
                } catch (e) {
                  // Keep as is
                }
              }

              return (
                <div key={candidate.id} onClick={() => setSelectedCandidate(candidate)} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-300 hover:shadow-md transition-all flex flex-col cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 leading-tight">{candidate.name}</h3>
                        <p className="text-slate-500 text-sm font-medium line-clamp-1">{candidate.headline || candidate.currentRole || 'Candidate'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleSave(candidate.id, !!candidate.isSaved, e)}
                        className={`p-2 rounded-lg transition-colors ${
                          candidate.isSaved ? 'bg-pink-50 text-pink-500 hover:bg-pink-100' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark size={18} className={candidate.isSaved ? "fill-pink-500" : ""} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 mb-4">
                    {parsedExp && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Briefcase size={14} className="text-slate-400" /> {parsedExp}
                      </span>
                    )}
                    {candidate.location && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <MapPin size={14} className="text-slate-400" /> {candidate.location}
                      </span>
                    )}
                    {candidate.currentCompany && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Building2 size={14} className="text-slate-400" /> {candidate.currentCompany}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {skillsArr.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold rounded-md">
                          {skill}
                        </span>
                      ))}
                      {skillsArr.length > 5 && (
                        <span className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-semibold rounded-md">
                          +{skillsArr.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-600">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        )}
      </main>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
              <h2 className="text-lg font-extrabold text-slate-900">Candidate Profile</h2>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-full flex items-center justify-center text-sky-700 font-extrabold text-2xl border-4 border-white shadow-sm">
                  {selectedCandidate.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{selectedCandidate.name}</h1>
                  <p className="text-slate-500 font-medium">{selectedCandidate.headline || 'Active Candidate'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Info</div>
                    <div className="text-sm font-medium text-slate-800">{selectedCandidate.email}</div>
                    <div className="text-sm font-medium text-slate-800">{selectedCandidate.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</div>
                    <div className="text-sm font-medium text-slate-800">{selectedCandidate.location || '-'}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</div>
                    <div className="text-sm font-medium text-slate-800">{selectedCandidate.currentRole || '-'} at {selectedCandidate.currentCompany || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Experience &amp; Salary</div>
                    <div className="text-sm font-medium text-slate-800">{selectedCandidate.experience || '-'} · Expected: {selectedCandidate.expectedSalary || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preferred Roles / Domain</div>
                <div className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedCandidate.preferredRoles || 'Not specified'}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let s: string[] = [];
                    try { s = JSON.parse(selectedCandidate.skills); } catch { s = []; }
                    if (s.length === 0) return <span className="text-sm text-slate-500">No skills listed</span>;
                    return s.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold rounded-lg">
                        {skill}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedCandidate.email}`}
                className="px-5 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm"
              >
                Contact Candidate
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
