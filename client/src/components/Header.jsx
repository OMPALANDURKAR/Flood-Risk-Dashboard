import React from 'react';
import { CloudRain } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 flex-shrink-0 bg-white border-b flex items-center justify-between px-6 relative z-10">

      {/* LEFT: Logo + Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-slate-900 p-2 rounded-md">
          <CloudRain className="text-white w-5 h-5" />
        </div>

        <h1 className="text-lg font-semibold">
          FloodSentry <span className="text-slate-400 font-light">Analytics</span>
        </h1>

        <span className="hidden sm:inline bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded border border-blue-100 font-semibold">
          V1.4 LIVE
        </span>
      </div>

      {/* CENTER: Title (optional, responsive safe) */}
      <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-slate-500 hidden lg:block">
        Flood & Coastal Risk Dashboard
      </div>

      {/* RIGHT: Status + Button */}
      <div className="flex items-center space-x-4">

        {/* Status */}
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-[10px] text-slate-400 font-bold tracking-wider">
            SYSTEM STATUS
          </span>
          <div className="flex items-center text-emerald-500 font-semibold text-sm space-x-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active</span>
          </div>
        </div>

        {/* Button */}
        <button className="border border-slate-200 px-3 py-1.5 rounded-md text-sm hover:bg-slate-50 transition">
          Export
        </button>

      </div>

    </header>
  );
}