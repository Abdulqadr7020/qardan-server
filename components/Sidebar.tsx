"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Search,
  History,
  Shield,
  User
} from 'lucide-react';

import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'viewer'] },
  { name: 'Packets', href: '/packets', icon: Package, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  { name: 'Past Records', href: '/history', icon: History, roles: ['admin', 'viewer'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => item.roles.includes(role || ''));

  return (
    <aside className="w-64 hidden lg:flex flex-col h-screen sticky top-0 bg-zinc-900 border-r border-zinc-800/80">
      <div className="p-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-1 mb-8">
          <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center shadow-sm shadow-cyan-900/50">
            <Logo size={22} className="text-zinc-950" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-50">Qardan DigiLocker</span>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive 
                    ? 'bg-cyan-950/50 text-cyan-400 font-bold' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50 font-medium'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-cyan-500' : 'text-zinc-500'} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="mt-auto p-6 border-t border-zinc-800/50">
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
    </aside>
  );
}
