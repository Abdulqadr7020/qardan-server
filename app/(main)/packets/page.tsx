"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  X,
  Loader2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { packetService, Packet, parseDurationToDays } from '@/services/packetService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PacketsPage() {
  const { role } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (role && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, router]);

  const [packets, setPackets] = useState<Packet[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOutwardModalOpen, setIsOutwardModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPacket, setNewPacket] = useState({
    id: '',
    sender: '',
    duration: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [outwardId, setOutwardId] = useState('');

  useEffect(() => {
    const fetchPackets = async () => {
      setLoading(true);
      const data = await packetService.getPackets();
      setPackets(data);
      setLoading(false);
    };
    fetchPackets();
  }, []);

  const filteredPackets = packets
    .filter(p => 
      p.sender.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => parseDurationToDays(a.duration) - parseDurationToDays(b.duration));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Packets Report", 14, 15);
    
    const tableData = filteredPackets.map(p => [
      p.id,
      p.sender,
      p.duration,
      p.date.split('-').reverse().join('-'),
      `₹${p.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['ID', 'Sender', 'Duration', 'Date', 'Amount']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [6, 182, 212] } // Cyan color
    });

    doc.save(`packets-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setIsExportOpen(false);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPackets.map(p => ({
      'ID': p.id,
      'Sender': p.sender,
      'Duration': p.duration,
      'Date': p.date.split('-').reverse().join('-'),
      'Amount': p.amount
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packets");
    XLSX.writeFile(workbook, `packets-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    setIsExportOpen(false);
  };

  const handleAddPacket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const added = await packetService.addPacket({
        packet_id: newPacket.id,
        sender: newPacket.sender,
        duration: newPacket.duration,
        amount: parseFloat(newPacket.amount) || 0,
        date: newPacket.date
      });
      setPackets(prev => [...prev, added]);
      setNewPacket({ 
        id: '', 
        sender: '', 
        duration: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0] 
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding packet:", err);
      alert("Failed to add packet. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePacket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await packetService.deletePacket(outwardId);
      const updated = await packetService.getPackets();
      setPackets(updated);
      setOutwardId('');
      setIsOutwardModalOpen(false);
    } catch (err) {
      console.error("Error deleting packet:", err);
      alert("Failed to delete packet. Check if the ID is correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-50">Packets</h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">Manage and track your system packets.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center justify-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs md:text-sm font-bold text-zinc-200 hover:bg-zinc-800/50 transition-all"
            >
              <Download size={16} />
              <span className="hidden xs:inline">Export</span>
            </button>
            
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <button 
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-colors text-left"
                >
                  <FileText size={16} className="text-rose-500" />
                  <span>Export to PDF</span>
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 transition-colors text-left"
                >
                  <FileSpreadsheet size={16} className="text-emerald-500" />
                  <span>Export to Excel</span>
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsOutwardModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs md:text-sm font-bold hover:bg-rose-500 hover:text-zinc-950 transition-all shadow-sm active:scale-95"
          >
            <X size={16} />
            <span>Outward</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-zinc-950 rounded-xl text-xs md:text-sm font-bold hover:bg-cyan-400 transition-all shadow-sm active:scale-95"
          >
            <Plus size={16} />
            <span>Inward</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" 
            placeholder="Search packets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/5 focus:border-cyan-500 transition-all font-medium text-zinc-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800/80 rounded-xl text-sm font-bold text-zinc-200 hover:bg-zinc-800/50 transition-all">
            <Filter size={16} className="text-cyan-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredPackets.map((packet) => (
          <div key={packet.id} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-sm active:bg-zinc-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20">
                {packet.packet_id}
              </span>
              <button className="text-zinc-600 hover:text-cyan-400 p-1">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm border border-zinc-700/50">
                {packet.sender.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-zinc-50 leading-tight">{packet.sender}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">{packet.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Date</p>
                <p className="text-xs text-zinc-300 font-medium">{packet.date.split('-').reverse().join('-')}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Amount</p>
                <p className="text-sm text-cyan-400 font-bold">₹{packet.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredPackets.length === 0 && (
          <div className="py-12 text-center bg-zinc-900 border border-zinc-800/80 rounded-2xl">
            <p className="text-zinc-500 font-medium">No packets found.</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-zinc-900 rounded-2xl border border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-800/30">
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">ID</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Sender</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Duration</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Date</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px] text-right">Amount</th>
                <th className="px-5 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredPackets.map((packet) => (
                <tr key={packet.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-cyan-500">
                    {packet.packet_id}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-zinc-50">{packet.sender}</span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {packet.duration}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {packet.date.split('-').reverse().join('-')}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-zinc-50">
                    ₹{packet.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-zinc-600 hover:text-cyan-400 transition-colors p-1.5 rounded-lg">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPackets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-zinc-500 font-medium">
                    No packets found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-5 py-4 border-t border-zinc-800/50 bg-zinc-800/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold">
          <p className="text-zinc-600 uppercase tracking-wider text-[10px]">
            Page <span className="text-zinc-50 font-black">1</span> of 1
          </p>
          <div className="flex items-center gap-1">
            <button disabled className="p-2 text-zinc-700 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg bg-cyan-500 text-zinc-950 text-xs">1</button>
            </div>
            <button disabled className="p-2 text-zinc-700 cursor-not-allowed">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Inward Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !loading && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-snappy">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-zinc-50 uppercase tracking-widest text-xs">Inward Packet</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddPacket} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Packet ID</label>
                <input
                  required
                  type="text"
                  value={newPacket.id}
                  onChange={(e) => setNewPacket({...newPacket, id: e.target.value})}
                  placeholder="e.g. PK-100"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Sender Name</label>
                <input
                  required
                  type="text"
                  value={newPacket.sender}
                  onChange={(e) => setNewPacket({...newPacket, sender: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-zinc-100"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Duration</label>
                <input
                  required
                  type="text"
                  value={newPacket.duration}
                  onChange={(e) => setNewPacket({...newPacket, duration: e.target.value})}
                  placeholder="e.g. 2 months"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Inward Date</label>
                <input
                  required
                  type="date"
                  value={newPacket.date}
                  onChange={(e) => setNewPacket({...newPacket, date: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-zinc-100"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Amount ($)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={newPacket.amount}
                  onChange={(e) => setNewPacket({...newPacket, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-zinc-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-zinc-950 py-3 rounded-xl font-bold text-sm hover:bg-cyan-400 transition-all shadow-lg active:scale-[0.98] mt-4 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Confirm Inward"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Outward Modal */}
      {isOutwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !loading && setIsOutwardModalOpen(false)}
          />
          <div className="relative w-full max-w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-snappy">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-zinc-50 uppercase tracking-widest text-xs text-rose-500">Outward Packet</h3>
              <button 
                onClick={() => setIsOutwardModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleDeletePacket} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Packet ID to Remove</label>
                <input
                  required
                  type="text"
                  value={outwardId}
                  onChange={(e) => setOutwardId(e.target.value)}
                  placeholder="e.g. PK-100"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-zinc-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-zinc-950 py-3 rounded-xl font-bold text-sm hover:bg-rose-400 transition-all shadow-lg active:scale-[0.98] mt-4 flex items-center justify-center"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Confirm Outward"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
