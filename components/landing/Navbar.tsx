'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LayoutDashboard, Menu, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/85 dark:bg-slate-900/70 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <img src="/loooo.jpeg" alt="The Job Sync Logo" className="h-12 w-auto object-contain rounded-full border border-gray-100 shadow-sm" />
            <span className="font-extrabold text-2xl text-[#1e3a8a] dark:text-sky-400 tracking-tight transition-colors">
              The Job Sync
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link href="/" className={`${isActive('/') ? 'text-sky-500 border-b-2 border-sky-500 pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-sky-500 transition-colors'} font-bold text-base`}>Home</Link>
            <Link href="/about" className={`${isActive('/about') ? 'text-sky-500 border-b-2 border-sky-500 pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-sky-500 transition-colors'} font-bold text-base`}>About Us</Link>
            <Link href="/companies" className={`${isActive('/companies') ? 'text-sky-500 border-b-2 border-sky-500 pb-1' : 'text-slate-800 dark:text-slate-200 hover:text-sky-500 transition-colors'} font-bold text-base`}>Companies</Link>
            <Link href="#" className="text-slate-800 dark:text-slate-200 hover:text-sky-500 font-bold text-base transition-colors">Job Seekers</Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/register" className="flex items-center gap-2 px-5 py-2.5 border-2 border-sky-500 text-sky-500 dark:text-sky-400 dark:border-sky-400 rounded-lg font-semibold hover:bg-sky-50 dark:hover:bg-white/5 transition-colors">
              <User size={18} strokeWidth={2.5} />
              <span>Register</span>
            </Link>
            <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-md">
              <LogIn size={18} strokeWidth={2.5} />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-slate-300 hover:text-sky-500 transition-colors">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/10 px-4 py-4 space-y-4 shadow-lg absolute w-full z-50">
          <Link href="/" className={`block ${isActive('/') ? 'text-sky-500' : 'text-slate-800 dark:text-slate-200 hover:text-sky-500'} font-bold text-base`}>Home</Link>
          <Link href="/about" className={`block ${isActive('/about') ? 'text-sky-500' : 'text-slate-800 dark:text-slate-200 hover:text-sky-500'} font-bold text-base`}>About Us</Link>
          <Link href="/companies" className={`block ${isActive('/companies') ? 'text-sky-500' : 'text-slate-800 dark:text-slate-200 hover:text-sky-500'} font-bold text-base`}>Companies</Link>
          <Link href="#" className="block text-slate-800 dark:text-slate-200 hover:text-sky-500 font-bold text-base">Job Seekers</Link>
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col space-y-3">
            <Link href="/register" className="flex justify-center items-center gap-2 w-full px-5 py-2.5 border-2 border-sky-500 text-sky-500 dark:text-sky-400 dark:border-sky-400 rounded-lg font-semibold hover:bg-sky-50 dark:hover:bg-white/5 transition-colors">
              <User size={18} strokeWidth={2.5} />
              <span>Register</span>
            </Link>
            <Link href="/login" className="flex justify-center items-center gap-2 w-full px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform shadow-md">
              <LogIn size={18} strokeWidth={2.5} />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
