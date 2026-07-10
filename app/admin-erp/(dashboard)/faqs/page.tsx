"use client";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", order: 0 });

  const fetchData = () => { fetch("/api/admin/faqs").then(r => r.json()).then(d => { setFaqs(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditId(null); setForm({ question: "", answer: "", order: faqs.length }); setShowModal(true); };
  const openEdit = (f: any) => { setEditId(f.id); setForm({ question: f.question, answer: f.answer, order: f.order }); setShowModal(true); };

  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    await fetch("/api/admin/faqs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowModal(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch("/api/admin/faqs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">FAQs</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800"><Plus size={16} /> Add FAQ</button>
      </div>
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No FAQs added yet</p>
        ) : faqs.map(f => (
          <div key={f.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Q: {f.question}</h3>
                <p className="text-sm text-gray-500 mt-2">A: {f.answer}</p>
              </div>
              <div className="flex gap-1 ml-4 shrink-0">
                <button onClick={() => openEdit(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editId ? "Edit FAQ" : "Add FAQ"}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Question" value={form.question} onChange={e => setForm({...form, question: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
              <textarea placeholder="Answer..." rows={4} value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm resize-none" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
