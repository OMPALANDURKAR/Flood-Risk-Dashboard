import React from 'react';
import { Search } from 'lucide-react';

export default function Sidebar({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="h-full p-6 flex flex-col gap-8 bg-[#1E293B]/80 backdrop-blur-lg border-r border-[#334155]">

      {/* ===== SEARCH ===== */}
      <div>
        <h3 className="text-[11px] font-semibold text-slate-400 tracking-widest mb-3 uppercase">
          Search Regions
        </h3>

        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#2DD4BF] transition" />

          <input
            type="text"
            placeholder="e.g. Forest, Clay"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/30 focus:border-[#2DD4BF] transition-all"
          />
        </div>
      </div>

      {/* ===== RISK LEVEL ===== */}
      <div>
        <h3 className="text-[11px] font-semibold text-slate-400 tracking-widest mb-3 uppercase">
          Risk Level Filter
        </h3>

        <div className="space-y-2 bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
          {['All', 'High', 'Medium', 'Low'].map((level) => {
            const active = filters.risk === level;

            const color =
              level === 'High'
                ? 'bg-red-500'
                : level === 'Medium'
                ? 'bg-amber-400'
                : level === 'Low'
                ? 'bg-emerald-400'
                : 'bg-slate-500';

            return (
              <label
                key={level}
                className={`flex items-center justify-between cursor-pointer p-2.5 rounded-lg transition-all ${
                  active
                    ? 'bg-[#1E293B] ring-1 ring-[#2DD4BF]/30 shadow-md'
                    : 'hover:bg-[#1E293B]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="risk"
                    checked={active}
                    onChange={() => handleChange('risk', level)}
                    className="accent-[#2DD4BF] cursor-pointer"
                  />

                  <span
                    className={`text-sm ${
                      active ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {level === 'All' ? 'All Levels' : `${level} Risk`}
                  </span>
                </div>

                <div
                  className={`w-2.5 h-2.5 rounded-full ${color} ${
                    active ? 'shadow-lg shadow-white/20 scale-110' : ''
                  }`}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* ===== RAINFALL FILTER ===== */}
      <div>
        <h3 className="text-[11px] font-semibold text-slate-400 tracking-widest mb-3 uppercase">
          Max Rainfall
        </h3>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
          <div className="flex justify-between text-xs text-slate-400 mb-4 items-center">
            <span>0 mm</span>

            <span className="font-semibold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-1 rounded-md">
              {filters.rainfall} mm
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="400"
            value={filters.rainfall}
            onChange={(e) =>
              handleChange('rainfall', Number(e.target.value))
            }
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF]"
          />
        </div>
      </div>

      {/* ===== RESET BUTTON ===== */}
      <div className="mt-auto">
        <button
          onClick={() =>
            setFilters({ search: '', risk: 'All', rainfall: 400 })
          }
          className="w-full bg-[#2DD4BF] text-black font-semibold py-3 rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all active:scale-[0.98]"
        >
          Reset Filters
        </button>
      </div>

    </aside>
  );
}