"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  CalendarClock, 
  AlertCircle,
  ArrowRight,
  CalendarDays,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { packetService, Packet } from '@/services/packetService';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { role } = useAuth();
  const [stats, setStats] = useState({ totalPackets: 0, totalValue: 0, dueSoon: 0 });
  const [recentPackets, setRecentPackets] = useState<Packet[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const packets = await packetService.getPackets();
      const currentStats = await packetService.getStats();
      setStats(currentStats);
      setRecentPackets(packets.slice(0, 5)); // order was descending in getPackets
    };
    fetchDashboardData();
  }, []);

  const statItems = [
    { 
      name: 'Total Packets', 
      value: stats.totalPackets.toString(), 
      icon: Package,
      color: 'text-cyan-500',
      bg: 'bg-cyan-950/50'
    },
    { 
      name: 'Due Soon', 
      value: stats.dueSoon.toString(), 
      icon: CalendarClock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    { 
      name: 'Total Value', 
      value: `₹${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
  ];

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-50">Overview</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Summary of activities.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800/80 rounded-xl text-[10px] md:text-xs font-bold text-zinc-500 shadow-sm self-start sm:self-auto uppercase tracking-widest">
          <CalendarDays size={14} className="text-cyan-600" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((stat) => (
          <div key={stat.name} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800/80 shadow-sm flex flex-col group transition-all hover:bg-zinc-800/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">{stat.name}</span>
              <div className={`p-2 rounded-xl ${stat.bg} border border-white/5`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-50">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Packets Table */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800/80 shadow-sm overflow-hidden mt-2">
        <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-800/20">
          <h3 className="text-xs font-bold text-zinc-50 uppercase tracking-widest">Recent Packets</h3>
          {role === 'admin' && (
            <Link 
              href="/packets"
              className="text-[10px] font-bold text-cyan-500 hover:text-cyan-300 transition-colors flex items-center gap-1 bg-cyan-950/50 px-2.5 py-1 rounded-lg uppercase tracking-wider"
            >
              View All
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
        
        <div className="p-1">
          {/* Mobile Recent Packets Cards */}
          <div className="grid grid-cols-1 gap-2 md:hidden p-4">
            {recentPackets.map((packet) => (
              <div key={packet.id} className="bg-zinc-800/30 border border-zinc-800/50 rounded-xl p-4 flex items-center justify-between active:bg-zinc-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950/30 flex items-center justify-center text-cyan-500 font-bold text-xs border border-cyan-500/10">
                    {packet.sender.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-50 text-sm leading-tight">{packet.sender}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">ID: {packet.packet_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-50 text-sm">₹{packet.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1">{packet.duration}</p>
                </div>
              </div>
            ))}
            {recentPackets.length === 0 && (
              <div className="py-8 text-center text-zinc-500 text-sm font-medium border border-dashed border-zinc-800 rounded-2xl">
                No recent activity.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[500px] sm:min-w-0">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-800/10">
                  <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">ID</th>
                  <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Sender</th>
                  <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Duration</th>
                  <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px] text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {recentPackets.map((packet) => (
                  <tr key={packet.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-cyan-500 font-bold">{packet.packet_id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-950/50 flex items-center justify-center text-cyan-400 text-[10px] font-black border border-cyan-900/50 shadow-sm shrink-0">
                          {packet.sender.charAt(0)}
                        </div>
                        <span className="font-bold text-zinc-50">{packet.sender}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 italic">{packet.duration}</td>
                    <td className="px-5 py-4 text-right font-black text-zinc-50">
                      ₹{packet.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {recentPackets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-zinc-500 font-medium">
                      No recent packets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
