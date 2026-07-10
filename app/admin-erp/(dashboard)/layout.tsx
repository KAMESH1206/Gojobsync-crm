import Link from "next/link";
import { LayoutDashboard, Briefcase, Users, FileText, Settings, HelpCircle, FileCheck, Mail } from "lucide-react";

export default function AdminERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center space-x-3">
          <div className="bg-white text-[#0f172a] p-1 rounded-md font-bold text-xl h-8 w-8 flex items-center justify-center">S</div>
          <div>
            <h1 className="font-bold tracking-wider text-sm">THEJOBSYNC</h1>
            <p className="text-[10px] text-gray-300 tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Main</h3>
            <nav className="space-y-1">
              <Link href="/admin-erp" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 text-white transition-colors">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link href="/admin-erp/job-board" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <Briefcase size={18} />
                <span className="text-sm font-medium">Job Board</span>
              </Link>
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Users</h3>
            <nav className="space-y-1">
              <Link href="/admin-erp/companies" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <Briefcase size={18} />
                <span className="text-sm font-medium">Companies</span>
              </Link>
              <Link href="/admin-erp/candidates" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <Users size={18} />
                <span className="text-sm font-medium">Candidates</span>
              </Link>
              <Link href="/admin-erp/resumes" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <FileText size={18} />
                <span className="text-sm font-medium">Resumes</span>
              </Link>
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Settings (CMS)</h3>
            <nav className="space-y-1">
              <Link href="/admin-erp/blog" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <FileCheck size={18} />
                <span className="text-sm font-medium">Blog</span>
              </Link>
              <Link href="/admin-erp/faqs" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <HelpCircle size={18} />
                <span className="text-sm font-medium">FAQs</span>
              </Link>
              <Link href="/admin-erp/newsletter" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <Mail size={18} />
                <span className="text-sm font-medium">Newsletter</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@thejobsync.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
           <div className="flex items-center space-x-2 text-sm text-gray-500">
             <span>Admin Panel</span>
             <span>/</span>
             <span className="text-gray-900 font-medium">Dashboard</span>
           </div>
           <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                 🔔
              </button>
              <Link href="/admin-erp/login" className="text-sm text-red-600 font-medium hover:underline">
                 Logout
              </Link>
           </div>
        </header>
        
        {children}
      </main>
    </div>
  );
}
