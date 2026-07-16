"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, Eye } from "lucide-react";

export default function SACompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ companyName: "", contactPerson: "", email: "", phone: "", address: "", industry: "", website: "", status: "active" });
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  const fetchData = () => { fetch("/api/admin/companies").then(r => r.json()).then(d => { setCompanies(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditId(null); setForm({ companyName: "", contactPerson: "", email: "", phone: "", address: "", industry: "", website: "", status: "active" }); setShowModal(true); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ companyName: c.companyName, contactPerson: c.contactPerson, email: c.email, phone: c.phone, address: c.address, industry: c.industry, website: c.website || "", status: c.status }); setShowModal(true); };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/admin/companies", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch("/api/admin/companies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };

  const filtered = companies.filter(c => c.companyName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Companies</h1>
        <div className="flex gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> Add</button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Company</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Contact</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Industry</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-400">No companies</td></tr> : filtered.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCompany(c)}>
                <td className="p-4"><div className="text-sm font-medium text-gray-800">{c.companyName}</div><div className="text-xs text-gray-400">{c.email}</div></td>
                <td className="p-4 text-sm text-gray-600">{c.contactPerson}</td>
                <td className="p-4 text-sm text-gray-600">{c.industry}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedCompany(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                    <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">{editId ? "Edit Company" : "Add Company"}</h2><button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><X size={20} /></button></div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Company Name</label><input type="text" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Contact Person</label><input type="text" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Industry</label><input type="text" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Address</label><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Website (Optional)</label><input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button><button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save</button></div>
          </div>
        </div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Company Details</h2>
              <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedCompany.companyName}</h3>
                <p className="text-gray-500 text-sm">{selectedCompany.industry}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Contact Person</span>
                  <span className="text-sm font-medium text-gray-800">{selectedCompany.contactPerson}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCompany.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedCompany.status}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email</span>
                  <span className="text-sm font-medium text-gray-800">{selectedCompany.email}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone</span>
                  <span className="text-sm font-medium text-gray-800">{selectedCompany.phone}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Address</span>
                  <span className="text-sm font-medium text-gray-800">{selectedCompany.address}</span>
                </div>
                {selectedCompany.website && (
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Website</span>
                    <a href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                      {selectedCompany.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button onClick={() => { openEdit(selectedCompany); setSelectedCompany(null); }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"><Edit size={16} /> Edit Company</button>
              <button onClick={() => setSelectedCompany(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
