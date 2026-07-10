"use client";
import { useState, useEffect } from "react";
import { Trash2, Mail } from "lucide-react";

export default function NewsletterPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { fetch("/api/admin/newsletter").then(r => r.json()).then(d => { setSubs(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await fetch("/api/admin/newsletter", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
        <div className="bg-white px-4 py-2 rounded-lg border text-sm text-gray-600">
          <Mail size={14} className="inline mr-2" /> Total: <span className="font-bold text-gray-800">{subs.length}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Subscribed</th>
              <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">No subscribers yet</td></tr>
            ) : subs.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-800">{s.email}</td>
                <td className="p-4 text-sm text-gray-600">{s.name || "N/A"}</td>
                <td className="p-4 text-sm text-gray-500">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                <td className="p-4"><button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
