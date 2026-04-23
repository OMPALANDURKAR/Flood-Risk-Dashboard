import React from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis
} from 'recharts';

export default function AnalyticsPanel({ analytics = {} }) {

  // ✅ Safe defaults (prevents undefined issues)
  const {
    activeHigh = 0,
    activeMedium = 0,
    activeLow = 0
  } = analytics;

  // 📊 Chart data
  const chartData = [
    { name: 'High', value: activeHigh },
    { name: 'Medium', value: activeMedium },
    { name: 'Low', value: activeLow }
  ];

  // 📈 Total + percentage
  const total = activeHigh + activeMedium + activeLow;

  const highRiskPercent = total
    ? Math.round((activeHigh / total) * 100)
    : 0;

  return (
    <aside className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto z-10 flex flex-col gap-6">

      {/* ===== RISK SUMMARY ===== */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">
          RISK ANALYTICS
        </h3>

        <div className="grid grid-cols-3 gap-3">

          <div className="border rounded-xl p-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold">HIGH</p>
            <p className="text-2xl font-light text-red-500">{activeHigh}</p>
          </div>

          <div className="border rounded-xl p-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold">MEDIUM</p>
            <p className="text-2xl font-light text-amber-500">{activeMedium}</p>
          </div>

          <div className="border rounded-xl p-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold">LOW</p>
            <p className="text-2xl font-light text-emerald-500">{activeLow}</p>
          </div>

        </div>
      </div>

      {/* ===== CHART ===== */}
      <div>
        <div className="flex justify-between text-sm mb-4">
          <strong className="text-slate-800">Risk Distribution</strong>
          <span className="text-xs text-slate-400 font-bold">COUNT</span>
        </div>

        {/* ✅ FIXED HEIGHT (CRITICAL FIX) */}
        <div className="w-full h-[200px] min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Bar
                dataKey="value"
                fill="#0f172a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== PREDICTIVE PANEL ===== */}
      <div className="bg-slate-900 rounded-xl p-5 text-white mt-auto">

        <div className="flex items-center space-x-2 mb-3">
          <div
            className={`w-2 h-2 rounded-full ${
              highRiskPercent > 50
                ? 'bg-red-500'
                : highRiskPercent > 30
                ? 'bg-orange-400'
                : 'bg-emerald-500'
            }`}
          ></div>

          <h4 className="text-xs font-bold tracking-wider">
            PREDICTIVE INSIGHT
          </h4>
        </div>

        <p className="text-sm text-slate-300 mb-4">
          {highRiskPercent > 50
            ? 'High probability of flood escalation detected.'
            : highRiskPercent > 30
            ? 'Moderate flood risk observed in multiple regions.'
            : 'Flood risk currently under control.'}
        </p>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>HIGH RISK INDEX</span>
            <span className="text-slate-400">{highRiskPercent}%</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                highRiskPercent > 50
                  ? 'bg-red-500'
                  : highRiskPercent > 30
                  ? 'bg-orange-400'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${highRiskPercent}%` }}
            ></div>
          </div>
        </div>

      </div>

    </aside>
  );
}