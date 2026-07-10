"use client";
import { useState, useEffect } from "react";
import { Save, CreditCard } from "lucide-react";

export default function PaymentSettingsPage() {
  const [form, setForm] = useState({ gatewayName: "razorpay", apiKey: "", apiSecret: "", gstRate: 18, invoicePrefix: "INV" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/payment").then(r => r.json()).then(d => {
      if (d && !d.message) setForm({ gatewayName: d.gatewayName || "razorpay", apiKey: d.apiKey || "", apiSecret: d.apiSecret || "", gstRate: d.gstRate || 18, invoicePrefix: d.invoicePrefix || "INV" });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CreditCard /> Payment Settings</h1>
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
            <select value={form.gatewayName} onChange={e => setForm({...form, gatewayName: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm">
              <option value="razorpay">Razorpay</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input value={form.apiKey} onChange={e => setForm({...form, apiKey: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm font-mono" placeholder="rzp_live_xxxxxxxxx" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
            <input type="password" value={form.apiSecret} onChange={e => setForm({...form, apiSecret: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm font-mono" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
              <input type="number" value={form.gstRate} onChange={e => setForm({...form, gstRate: Number(e.target.value)})} className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
              <input value={form.invoicePrefix} onChange={e => setForm({...form, invoicePrefix: e.target.value})} className="w-full p-2.5 border rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50">
              <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">✅ Settings saved successfully!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
