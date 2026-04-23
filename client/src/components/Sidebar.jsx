import React from 'react';
import { Search } from 'lucide-react';

export default function Sidebar({ filters, setFilters }) {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 p-5 overflow-y-auto z-10 flex flex-col gap-6">
      
      {/* Location Search */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">LOCATION SEARCH</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" placeholder="e.g. Kozhikode"
            className="w-full border border-slate-200 rounded-md pl-9 py-2 text-sm focus:outline-none focus:border-blue-500"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
      </div>

      {/* Threat Level */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">THREAT LEVEL</h3>
        <div className="space-y-3 text-sm">
          {['High Risk', 'Medium Risk', 'Low Risk'].map(level => {
             const riskValue = level.split(' ')[0];
             const color = riskValue === 'High' ? 'bg-red-500' : riskValue === 'Medium' ? 'bg-amber-400' : 'bg-emerald-500';
             return (
              <label key={level} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input type="radio" name="risk" className="w-4 h-4 accent-slate-900" 
                    onChange={() => setFilters({...filters, risk: riskValue})} />
                  <span>{level}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${color}`}></div>
              </label>
             )
          })}
        </div>
        <button 
          onClick={() => setFilters({...filters, risk: 'All', search: '', rainfall: 400})}
          className="w-full mt-4 bg-slate-900 text-white text-sm py-2.5 rounded-md hover:bg-slate-800 transition">
          Clear Filters
        </button>
      </div>

      {/* Rainfall Limit */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">RAINFALL LIMIT</h3>
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
           <div className="flex justify-between text-xs text-slate-500 mb-2">
             <span>0mm</span>
             <span className="font-mono bg-white px-2 py-0.5 border border-slate-200 rounded">{filters.rainfall}</span>
           </div>
           <input type="range" min="0" max="400" className="w-full accent-blue-600"
             value={filters.rainfall} 
             onChange={(e) => setFilters({...filters, rainfall: e.target.value})} />
        </div>
      </div>

    </aside>
  );
}