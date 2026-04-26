import React from 'react';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip
} from 'recharts';

export default function AnalyticsPanel({ analytics }) {

  const data = [
    { name: 'High', value: analytics.activeHigh },
    { name: 'Medium', value: analytics.activeMedium },
    { name: 'Low', value: analytics.activeLow }
  ];

  const total =
    analytics.activeHigh +
    analytics.activeMedium +
    analytics.activeLow;

  const highRiskPercent = total
    ? Math.round((analytics.activeHigh / total) * 100)
    : 0;

  const getColor = () => {
    if (highRiskPercent > 50) return '#ef4444';
    if (highRiskPercent > 30) return '#f59e0b';
    return '#2DD4BF';
  };

  return (
    <aside className="w-80 glass p-5 flex flex-col gap-6">

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-3 gap-3">
        {['High', 'Medium', 'Low'].map((type, i) => {
          const val = data[i].value;
          const color =
            type === 'High'
              ? 'text-red-400'
              : type === 'Medium'
              ? 'text-yellow-400'
              : 'text-emerald-400';

          return (
            <div key={type} className="card-hover bg-[#0F172A] p-4 rounded-xl text-center border border-[#334155]">
              <p className="text-xs text-slate-400">{type}</p>
              <p className={`text-2xl ${color}`}>{val}</p>
            </div>
          );
        })}
      </div>

      {/* ===== CHART ===== */}
      <div>
        <h3 className="text-sm mb-3">Risk Distribution</h3>

        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#A78BFA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== AI PANEL ===== */}
      <div className="bg-[#0F172A] p-5 rounded-xl border border-[#334155] card-hover">

        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: getColor() }}
          />
          <h4 className="text-xs tracking-wider">AI RISK ENGINE</h4>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          {highRiskPercent > 50
            ? 'Critical flood escalation detected.'
            : highRiskPercent > 30
            ? 'Moderate flood risk spreading.'
            : 'Flood conditions stable.'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#1E293B] rounded-full h-2">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${highRiskPercent}%`,
              background: getColor()
            }}
          />
        </div>

        <p className="text-xs mt-2 text-right text-slate-400">
          {highRiskPercent}% risk
        </p>
      </div>

    </aside>
  );
}