import React from 'react';
import { CloudRain } from 'lucide-react';

export default function Header() {
  return (
    // Added glassmorphism (bg-white/90 + backdrop-blur)
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 relative z-10">

      {/* LEFT: Logo + Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl shadow-md shadow-blue-500/20">
          <CloudRain className="text-white w-5 h-5" />
        </div>

        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          FloodSentry <span className="text-slate-400 font-normal">Analytics</span>
        </h1>

        <span className="hidden sm:inline bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-100 font-bold ml-2">
          V1.4 Live
        </span>
      </div>

      {/* CENTER: Title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-slate-400 hidden lg:block">
        Flood & Coastal Risk Dashboard
      </div>

      {/* RIGHT: Status + Button */}
      <div className="flex items-center space-x-6">
        {/* Status */}
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-[10px] text-slate-400 font-bold tracking-wider">
            SYSTEM STATUS
          </span>
          <div className="flex items-center text-emerald-500 font-semibold text-sm space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span>Active</span>
          </div>
        </div>

        {/* Button */}
        <button className="bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all">
          Export Data
        </button>
      </div>

    </header>
  );
}