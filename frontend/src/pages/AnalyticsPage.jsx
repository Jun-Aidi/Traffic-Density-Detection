import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    hour_data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    density_dist: [],
    vehicle_types: []
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/analytics')
      .then(r => r.json())
      .then(d => {
        if (d && d.hour_data) setAnalytics(d);
      })
      .catch(e => console.error("Error fetching analytics:", e));
  }, []);

  const HOUR_LABELS = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  const HOUR_DATA   = analytics.hour_data;
  const MAX_VAL = Math.max(...HOUR_DATA, 1);

  const DENSITY_DIST = analytics.density_dist;
  const VEHICLE_TYPES = analytics.vehicle_types;
  return (
    <div className="space-y-6">
      {/* Bar Chart — Vehicles per Hour */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Rata-rata Kendaraan per Jam</h3>
            <p className="text-xs text-slate-500">Berdasarkan data historis 7 hari</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-5 mt-3 ml-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-brand-500 inline-block"></span>
            <span className="text-xs text-slate-500">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
            <span className="text-xs text-slate-500">Rush Hour (≥15)</span>
          </div>
        </div>

        <div className="flex items-end gap-2 h-44 px-1">
          {HOUR_DATA.map((val, i) => {
            const heightPct = Math.round((val / MAX_VAL) * 100);
            const isRush = val >= 15;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono font-semibold">
                  {val}
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${isRush ? 'bg-amber-400' : 'bg-brand-400'} hover:brightness-110`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis */}
        <div className="flex gap-2 px-1 mt-2">
          {HOUR_LABELS.map(h => (
            <div key={h} className="flex-1 text-center text-xs text-slate-400 font-mono">{h}</div>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center mt-1">Jam (WIB)</p>
      </div>

      {/* Bottom row: two cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Density Distribution */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Distribusi Kepadatan</h3>
              <p className="text-xs text-slate-500">Persentase kemunculan setiap kategori</p>
            </div>
          </div>

          <div className="space-y-4">
            {DENSITY_DIST.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">{d.label}</span>
                  <span className="text-slate-500 font-mono font-semibold">{d.count}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${d.color} transition-all duration-700`}
                    style={{ width: `${d.count}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Type Breakdown */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 3l-5.447-2.724A1 1 0 0015 5.618v10.764a1 1 0 001.447.894L21 14M15 7v13" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Komposisi Kendaraan</h3>
              <p className="text-xs text-slate-500">Berdasarkan deteksi selama 7 hari</p>
            </div>
          </div>

          <div className="space-y-4">
            {VEHICLE_TYPES.map((v) => (
              <div key={v.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600 font-medium">{v.label}</span>
                  <span className="text-slate-500 font-mono font-semibold">{v.pct}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${v.color} transition-all duration-700`}
                    style={{ width: `${v.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
