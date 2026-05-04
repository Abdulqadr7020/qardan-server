"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut,
  History,
  Shield
} from 'lucide-react';

import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'viewer'] },
  { name: 'Packets', href: '/packets', icon: Package, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  { name: 'Past Records', href: '/history', icon: History, roles: ['admin', 'viewer'] },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { role, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => item.roles.includes(role || ''));

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-cyan-900/50 selection:text-indigo-900">
      
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[40] lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800/80 z-[50] lg:hidden transform transition-transform duration-200 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center">
                <Logo size={20} className="text-zinc-950" />
              </div>
              <span className="text-base font-bold text-zinc-50">Qardan DigiLocker</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500">
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-cyan-950/50 text-cyan-400 font-bold' 
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50 font-medium'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-cyan-500' : 'text-zinc-500'} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-5 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-1 mb-5">
              <div className={`w-9 h-9 rounded-xl ${role === 'admin' ? 'bg-cyan-950/50 border-cyan-900/50 text-cyan-400' : 'bg-blue-950/50 border-blue-900/50 text-blue-400'} border flex items-center justify-center font-bold text-xs`}>
                {role === 'admin' ? 'AK' : 'PV'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-50 leading-tight">
                  {role === 'admin' ? 'Abdulqadir K.' : 'Public Viewer'}
                </span>
                <span className={`text-[10px] ${role === 'admin' ? 'text-cyan-500' : 'text-blue-500'} font-bold uppercase tracking-wider mt-0.5`}>
                  {role === 'admin' ? 'Administrator' : 'View Only'}
                </span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 w-full text-zinc-500 hover:text-rose-500 transition-colors font-medium"
            >
              <LogOut size={16} />
              <span className="text-sm font-bold">Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/90 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-400 lg:hidden rounded-lg hover:bg-zinc-800/50"
            >
              <Menu size={18} />
            </button>
            <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <Logo size={20} className="text-zinc-950" />
            </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-500 hover:text-cyan-400 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-zinc-950"></span>
            </button>
            <div className="h-5 w-[1px] bg-zinc-800"></div>
            <div className={`w-7 h-7 rounded-lg ${role === 'admin' ? 'bg-cyan-950/50 border-cyan-900/50 text-cyan-400' : 'bg-blue-950/50 border-blue-900/50 text-blue-400'} border flex items-center justify-center font-bold text-[10px]`}>
              {role === 'admin' ? 'AK' : 'PV'}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-snappy">
          {children}
        </main>
      </div>
    </div>
  );
}
