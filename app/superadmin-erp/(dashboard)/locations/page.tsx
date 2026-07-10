"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X, MapPin } from "lucide-react";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", state: "", country: "India" });

  const fetchData = () => { fetch("/api/admin/locations").then(r => r.json()).then(d => { setLocations(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    await fetch("/api/admin/locations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false); setForm({ name: "", state: "", country: "India" }); fetchData();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch("/api/admin/locations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><MapPin /> Locations</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> Add Location</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {locations.length === 0 ? <p className="col-span-full text-center text-gray-400 py-8">No locations added yet</p> : locations.map(l => (
          <div key={l.id} className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg"><MapPin className="w-4 h-4 text-blue-600" /></div>
              <div><p className="text-sm font-medium text-gray-800">{l.name}</p><p className="text-xs text-gray-400">{l.state ? `${l.state}, ` : ''}{l.country}</p></div>
            </div>
            <button onClick={() => handleDelete(l.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Add Location</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="City/Area Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="State" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <input placeholder="Country" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Add</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
