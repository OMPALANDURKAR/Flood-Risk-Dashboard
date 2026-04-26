import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function AnalyticsPanel({ analytics }) {
  const data = [
    { name: 'High', value: analytics.activeHigh },
    { name: 'Medium', value: analytics.activeMedium },
    { name: 'Low', value: analytics.activeLow }
  ];

  const total = analytics.activeHigh + analytics.activeMedium + analytics.activeLow;
  const highRiskPercent = total ? Math.round((analytics.activeHigh / total) * 100) : 0;

  const getColor = () => {
    if (highRiskPercent > 50) return '#ef4444';
    if (highRiskPercent > 30) return '#fbbf24';
    return '#2dd4bf';
  };

  const getBarColor = (name) => {
    if (name === 'High') return '#ef4444';
    if (name === 'Medium') return '#fbbf24';
    return '#2dd4bf';
  };

  return (
    <aside className="w-full h-full p-6 flex flex-col gap-8 text-slate-200 overflow-y-auto">
      
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          Live Analytics
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
      </div>

      {/* Glowing Stats */}
      <div className="grid grid-cols-3 gap-3">
        {['High', 'Medium', 'Low'].map((type, i) => {
          const val = data[i].value;
          const colorClass =
            type === 'High' ? 'text-[#ef4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]' :
            type === 'Medium' ? 'text-[#fbbf24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' :
            'text-[#2dd4bf] drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]';

          return (
            <div key={type} className="group relative overflow-hidden bg-slate-950/40 p-4 rounded-2xl border border-white/5 shadow-inner transition-all hover:bg-slate-800/60 flex flex-col items-center justify-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{type}</p>
              <p className={`text-3xl font-semibold font-sans ${colorClass}`}>{val}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px] flex flex-col">
        <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mb-4">
          Risk Distribution
        </h3>
        <div className="flex-1 bg-slate-950/30 rounded-2xl p-4 border border-white/5 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => (val === 0 ? '' : val)} />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={45}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Panel */}
      <div className="relative bg-slate-950/50 p-6 rounded-2xl border border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] overflow-hidden mt-auto">
        <div className="absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-20 pointer-events-none" style={{ background: getColor() }}></div>

        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: getColor(), boxShadow: `0 0 12px ${getColor()}` }} />
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
            AI Risk Engine
          </h4>
        </div>

        <p className="text-sm font-medium text-slate-400 mb-5 leading-relaxed relative z-10">
          {highRiskPercent > 50 ? 'Critical flood escalation detected.' : highRiskPercent > 30 ? 'Moderate flood risk spreading.' : 'Flood conditions stable.'}
        </p>

        <div className="w-full bg-slate-900 rounded-full h-2 border border-white/5 overflow-hidden relative z-10">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${highRiskPercent}%`, background: getColor(), boxShadow: `0 0 10px ${getColor()}` }} />
        </div>

        <div className="flex justify-between items-center mt-3 relative z-10">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Threat Level</span>
          <span className="text-xs font-bold text-white">{highRiskPercent}%</span>
        </div>
      </div>

    </aside>
  );
}