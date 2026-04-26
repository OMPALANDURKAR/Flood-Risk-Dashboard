import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function Sidebar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-full h-full p-6 flex flex-col gap-8 text-slate-200 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Global Filters
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
      </div>

      {/* Search */}
      <div>
        <h3 className="text-[10px] font-semibold text-slate-500 tracking-widest mb-3 uppercase">
          Search Regions
        </h3>
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="e.g. Forest, Clay..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Risk Filter */}
      <div>
        <h3 className="text-[10px] font-semibold text-slate-500 tracking-widest mb-3 uppercase">
          Risk Level
        </h3>
        <div className="space-y-1.5 bg-slate-950/30 p-2 rounded-2xl border border-white/5 shadow-inner">
          {['All', 'High', 'Medium', 'Low'].map((level) => {
            const active = filters.risk === level;
            
            let colorClass = 'bg-slate-600 shadow-[0_0_8px_rgba(71,85,105,0.5)]';
            if (level === 'High') colorClass = 'bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.8)]';
            if (level === 'Medium') colorClass = 'bg-[#fbbf24] shadow-[0_0_12px_rgba(251,191,36,0.8)]';
            if (level === 'Low') colorClass = 'bg-[#2dd4bf] shadow-[0_0_12px_rgba(45,212,191,0.8)]';
            if (level === 'All' && active) colorClass = 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]';

            return (
              <label
                key={level}
                className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-300 ${
                  active ? 'bg-slate-800/80 border border-white/10 shadow-md' : 'bg-transparent border border-transparent hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="risk"
                    checked={active}
                    onChange={() => handleChange('risk', level)}
                    className="sr-only"
                  />
                  <span className={`text-sm tracking-wide ${active ? 'text-white font-medium' : 'text-slate-400'}`}>
                    {level === 'All' ? 'All Levels' : `${level} Risk`}
                  </span>
                </div>
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${colorClass} ${active ? 'scale-125' : 'scale-100 opacity-60'}`} />
              </label>
            );
          })}
        </div>
      </div>

      {/* Rainfall Slider */}
      <div>
        <h3 className="text-[10px] font-semibold text-slate-500 tracking-widest mb-3 uppercase">
          Max Rainfall Threshold
        </h3>
        <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5 shadow-inner flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">0 mm</span>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              {filters.rainfall} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="400"
            value={filters.rainfall}
            onChange={(e) => handleChange('rainfall', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Reset */}
      <div className="mt-auto pt-4">
        <button
          onClick={() => setFilters({ search: '', risk: 'All', rainfall: 400 })}
          className="w-full group flex items-center justify-center gap-2 bg-slate-900/50 border border-white/10 text-slate-400 text-sm font-semibold py-3.5 rounded-xl hover:text-white hover:bg-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          Reset Filters
        </button>
      </div>

    </aside>
  );
}