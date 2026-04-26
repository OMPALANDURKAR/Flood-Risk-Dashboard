import React from 'react';
import { CloudRain } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full h-full flex items-center justify-between">
      
      {/* Branding */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-white/20">
          <CloudRain className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
          FloodSentry <span className="text-slate-400 font-normal ml-1.5">Analytics</span>
        </h1>
        <span className="hidden sm:flex items-center bg-indigo-500/10 text-indigo-300 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 font-bold ml-3 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
          V2.0 Live
        </span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest hidden lg:block">
        Global Risk & Telemetry Dashboard
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-8">
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mb-1">
            System Status
          </span>
          <div className="flex items-center text-emerald-400 font-medium text-sm space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            <span className="tracking-wide">Active</span>
          </div>
        </div>

        <button className="bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-lg px-5 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:border-white/20 hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 group">
          Export Report
          <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>

    </header>
  );
}