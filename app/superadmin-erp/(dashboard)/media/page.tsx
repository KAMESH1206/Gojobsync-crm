"use client";
import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function MediaPage() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setFiles(prev => [...prev, { name: file.name, url: data.url }]);
      }
    } catch (err) {
      alert("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><ImageIcon /> Media Library</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-slate-800 cursor-pointer">
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload File"}
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*,.pdf" />
        </label>
      </div>
      {files.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">No media files uploaded yet.</p>
          <p className="text-gray-400 text-xs mt-1">Click "Upload File" to add images, videos or documents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img src={f.url} alt={f.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-3"><p className="text-xs text-gray-600 truncate">{f.name}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
