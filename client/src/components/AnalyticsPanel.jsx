import React from 'react';
import { BarChart, Bar, ResponsiveContainer, YAxis } from 'recharts';

const mockChartData =[
  { name: 'N1', value: 60 }, { name: 'N2', value: 45 }, { name: 'C1', value: 40 },
  { name: 'C2', value: 35 }, { name: 'S1', value: 20 }, { name: 'S2', value: 10 }
];

export default function AnalyticsPanel({ analytics }) {
  return (
    <aside className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto z-10 flex flex-col gap-6">
      
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">DISTRICT RISK ANALYTICS</h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-slate-400 tracking-wider">ACTIVE HIGH</p>
            <p className="text-3xl font-light mt-1">{analytics.activeHigh}</p>
          </div>
          <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-slate-400 tracking-wider">COASTAL RISK</p>
            <p className="text-3xl font-light mt-1">0</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-4">
          <strong className="text-slate-800">Rainfall Distribution</strong>
          <span className="text-xs text-slate-400 font-bold">MM</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Bar dataKey="value" fill="#0f172a" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest mt-2 px-6">
          <span>NORTH</span>
          <span>CENTRAL</span>
          <span>SOUTH</span>
        </div>
      </div>

      {/* Predictive Engine Panel (Matching UI) */}
      <div className="bg-slate-900 rounded-xl p-5 text-white mt-auto">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <h4 className="text-xs font-bold tracking-wider">PREDICTIVE ENGINE</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Dynamic thresholding detected in <strong className="text-white">localized sectors.</strong>
        </p>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>MUMBAI CITY</span>
            <span className="text-slate-400">65% Prob</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 mb-1">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
      
    </aside>
  );
}