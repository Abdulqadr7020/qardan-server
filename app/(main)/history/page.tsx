"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { packetService, ArchivedPacket } from '@/services/packetService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function HistoryPage() {
  const [archivedPackets, setArchivedPackets] = useState<ArchivedPacket[]>([]);
  const [search, setSearch] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await packetService.getArchivedPackets();
      setArchivedPackets(data);
    };
    fetchHistory();
  }, []);

  const filteredPackets = archivedPackets.filter(p => 
    p.sender.toLowerCase().includes(search.toLowerCase()) ||
    p.packet_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Past Records Report (1 Year)", 14, 15);
    
    const tableData = filteredPackets.map(p => [
      p.packet_id,
      p.sender,
      p.duration,
      p.date.split('-').reverse().join('-'),
      new Date(p.outward_date).toLocaleDateString('en-GB'), // dd/mm/yyyy
      `₹${p.amount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['ID', 'Sender', 'Duration', 'Inward Date', 'Outward Date', 'Amount']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [6, 182, 212] }
    });

    doc.save(`history-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setIsExportOpen(false);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPackets.map(p => ({
      'ID': p.packet_id,
      'Sender': p.sender,
      'Duration': p.duration,
      'Inward Date': p.date.split('-').reverse().join('-'),
      'Outward Date': new Date(p.outward_date).toLocaleDateString('en-GB'),
      'Amount': p.amount
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Past Records");
    XLSX.writeFile(workbook, `history-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    setIsExportOpen(false);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-50">Past 1 Year Record</h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">View outwarded packets. Records older than 1 year are automatically deleted.</p>
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
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input 
            type="text" 
            placeholder="Search archived packets..." 
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
              <span className="px-2 py-1 bg-zinc-800/50 text-zinc-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-zinc-700/50">
                {packet.packet_id}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/30 text-rose-500 text-[10px] font-bold border border-rose-500/10 uppercase tracking-wider">
                <Clock size={12} />
                Out: {new Date(packet.outward_date).toLocaleDateString('en-GB')}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-sm border border-zinc-700/50">
                {packet.sender.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-zinc-50 leading-tight">{packet.sender}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">{packet.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Inward Date</p>
                <p className="text-xs text-zinc-300 font-medium">{packet.date.split('-').reverse().join('-')}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Amount</p>
                <p className="text-sm text-zinc-100 font-bold">₹{packet.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredPackets.length === 0 && (
          <div className="py-12 text-center bg-zinc-900 border border-zinc-800/80 rounded-2xl">
            <p className="text-zinc-500 font-medium">No records found.</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-zinc-900 rounded-2xl border border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[700px] sm:min-w-0">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-800/30">
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">ID</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Sender</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Duration</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Inward Date</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Outward Date</th>
                <th className="px-5 py-4 font-bold text-zinc-500 uppercase tracking-wider text-[10px] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredPackets.map((packet) => (
                <tr key={packet.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-zinc-400">
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
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/50 text-zinc-300 text-[10px] font-bold border border-zinc-700/50 uppercase tracking-wider">
                      <Clock size={12} className="text-zinc-500" />
                      {new Date(packet.outward_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-zinc-50">
                    ₹{packet.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {filteredPackets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-zinc-500 font-medium">
                    No records found in the past 1 year.
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
              <button className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 text-xs">1</button>
            </div>
            <button disabled className="p-2 text-zinc-700 cursor-not-allowed">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
