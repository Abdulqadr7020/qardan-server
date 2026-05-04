"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Monitor, 
  Shield, 
  Database, 
  LogOut,
  Save,
  ChevronRight,
  Mail,
  Smartphone,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { role, logout } = useAuth();
  const router = useRouter();
  
  // Protect route
  useEffect(() => {
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-50">Settings</h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">Manage your account and app preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-500 text-zinc-950 rounded-xl text-sm font-bold hover:bg-cyan-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : saved ? "Changes Saved!" : "Save Changes"}
          {!loading && !saved && <Save size={16} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-sm font-bold">{tab.name}</span>
                </div>
                {activeTab === tab.id && <div className="w-1 h-4 bg-cyan-500 rounded-full" />}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-snappy">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-zinc-800/50">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-3xl font-black">
                      AK
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-cyan-400 transition-colors shadow-xl">
                      <Smartphone size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-50">Profile Picture</h3>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB. Recommended size 400x400.</p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-bold text-zinc-300 hover:text-zinc-50 transition-colors">Change</button>
                      <button className="px-4 py-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Abdulqadir Kapadiya"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input 
                        type="email" 
                        defaultValue="admin@qardan.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-zinc-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Role</label>
                    <input 
                      type="text" 
                      disabled
                      value="System Administrator"
                      className="w-full bg-zinc-800/30 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Location</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input 
                        type="text" 
                        defaultValue="India"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all text-zinc-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-snappy">
                <div className="pb-6 border-b border-zinc-800/50">
                  <h3 className="text-lg font-bold text-zinc-50">Password</h3>
                  <p className="text-xs text-zinc-500 mt-1">Change your password regularly to keep your account secure.</p>
                  
                  <div className="mt-6 space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all text-zinc-100" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all text-zinc-100" />
                    </div>
                    <button className="px-5 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-all mt-2">Update Password</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-50 flex items-center gap-2">
                    <Shield size={20} className="text-emerald-500" />
                    Security Features
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                          <Shield size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">Two-Factor Authentication</h4>
                          <p className="text-[10px] text-zinc-500 font-medium">Currently enabled with email and SMS.</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-black uppercase tracking-wider">Active</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-100">Biometric Login</h4>
                          <p className="text-[10px] text-zinc-500 font-medium">Use Fingerprint or Face ID to sign in.</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg text-xs font-black uppercase tracking-wider">Configure</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-snappy">
                <h3 className="text-lg font-bold text-zinc-50">Notification Preferences</h3>
                <p className="text-xs text-zinc-500 -mt-4">Choose what alerts you want to receive.</p>

                <div className="space-y-2 mt-4">
                  {[
                    { title: 'Email Notifications', desc: 'Receive daily summaries and activity reports.', active: true },
                    { title: 'Security Alerts', desc: 'Get notified about new logins and security updates.', active: true },
                    { title: 'New Packet Inward', desc: 'Instant alert when a new packet is added.', active: false },
                    { title: 'Due Soon Reminders', desc: 'Get notified 3 days before a packet duration ends.', active: true },
                    { title: 'Marketing Updates', desc: 'Receive news about new features and updates.', active: false },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-2xl">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                        <p className="text-[10px] text-zinc-500 font-medium">{item.desc}</p>
                      </div>
                      <button 
                        className={`w-10 h-5 rounded-full transition-all relative ${item.active ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                        onClick={() => {}}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-zinc-950 transition-all ${item.active ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-snappy">
                <div>
                  <h3 className="text-lg font-bold text-zinc-50">System Preferences</h3>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <Monitor size={20} className="text-cyan-500" />
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Theme</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-100">Appearance</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 mb-4">Choose your preferred visual style.</p>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-zinc-900 border border-cyan-500 rounded-xl text-xs font-bold text-cyan-500">Dark</button>
                        <button className="flex-1 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500">Light</button>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <Database size={20} className="text-amber-500" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Data</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-100">Storage Usage</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 mb-4">Local storage is 14% full (1.2 MB).</p>
                      <button className="w-full py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-zinc-950 transition-all">Clear All Data</button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                      <LogOut size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">Logout Everywhere</h4>
                      <p className="text-[10px] text-zinc-500 max-w-xs mx-auto mt-1">This will sign you out of all other active sessions and devices.</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="px-6 py-2 bg-rose-500 text-zinc-950 font-bold rounded-xl text-xs hover:bg-rose-400 transition-all active:scale-95 mt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
