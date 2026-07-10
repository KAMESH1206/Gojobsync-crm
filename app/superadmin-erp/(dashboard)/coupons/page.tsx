"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", discount: 10, maxUses: 100, validFrom: "", validUntil: "" });

  const fetchData = () => { fetch("/api/admin/coupons").then(r => r.json()).then(d => { setCoupons(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch("/api/admin/coupons", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); fetchData(); };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
        <button onClick={() => { setForm({ code: "", discount: 10, maxUses: 100, validFrom: new Date().toISOString().split('T')[0], validUntil: "" }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> Create Coupon</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Code</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Discount</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Usage</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Valid Until</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody>
            {coupons.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">No coupons yet</td></tr> : coupons.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4"><span className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">{c.code}</span></td>
                <td className="p-4 text-sm font-semibold text-green-600">{c.discount}%</td>
                <td className="p-4 text-sm text-gray-600">{c.usedCount}/{c.maxUses}</td>
                <td className="p-4 text-sm text-gray-600">{c.validUntil}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'Active' : 'Expired'}</span></td>
                <td className="p-4"><button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold">Create Coupon</h2><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <input placeholder="Coupon Code (e.g. SAVE20)" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full p-2.5 border rounded-lg text-sm font-mono" />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Discount (%)</label><input type="number" value={form.discount} onChange={e => setForm({...form, discount: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Max Uses</label><input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Valid From</label><input type="date" value={form.validFrom} onChange={e => setForm({...form, validFrom: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Valid Until</label><input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Create</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
