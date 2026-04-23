import React from 'react';
import { CloudRain, Download, Monitor, RefreshCcw } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center space-x-3">
        <div className="bg-slate-900 p-2 rounded-md"><CloudRain className="text-white w-5 h-5" /></div>
        <h1 className="text-xl font-bold">FloodSentry <span className="text-slate-400 font-light">Analytics</span></h1>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded border border-blue-100 font-semibold">V1.4 LIVE</span>
      </div>
      
      <div className="text-sm font-semibold text-slate-600 absolute left-1/2 -translate-x-1/2 hidden md:block">
        Flood & Coastal Risk Dashboard
      </div>

      <div className="flex items-center space-x-6 text-sm">
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-400 font-bold tracking-wider">SYSTEM STATUS</span>
          <div className="flex items-center text-emerald-500 font-semibold space-x-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sync Active</span>
          </div>
        </div>
        <button className="flex items-center space-x-2 border border-slate-200 px-4 py-2 rounded-md hover:bg-slate-50 transition">
          <span>Export Reports</span>
        </button>
      </div>
    </header>
  );
}