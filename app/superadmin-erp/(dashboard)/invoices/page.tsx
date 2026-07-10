"use client";
import { useState, useEffect } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { fetch("/api/admin/invoices").then(r => r.json()).then(d => { setInvoices(Array.isArray(d) ? d : []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/invoices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Invoice #</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Company</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Package</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Status</th><th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody>
            {invoices.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-gray-400">No invoices yet</td></tr> : invoices.map(i => (
              <tr key={i.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-mono font-medium text-gray-800">{i.invoiceNumber}</td>
                <td className="p-4 text-sm text-gray-600">{i.companyName}</td>
                <td className="p-4 text-sm text-gray-600">{i.packageName}</td>
                <td className="p-4 text-sm font-semibold text-gray-800">₹{i.totalAmount}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${i.status === 'paid' ? 'bg-green-100 text-green-700' : i.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{i.status}</span></td>
                <td className="p-4">
                  {i.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(i.id, "paid")} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium hover:bg-green-100">Mark Paid</button>
                      <button onClick={() => updateStatus(i.id, "cancelled")} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100">Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
