import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    hour_data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    density_dist: [],
    vehicle_types: []
  });

  const [heatmap, setHeatmap] = useState({ matrix: [], days: [], hours: [], max_avg: 1 });
  const [tooltip, setTooltip] = useState(null); // { day, hour, avg, x, y }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/analytics')
      .then(r => r.json())
      .then(d => { if (d && d.hour_data) setAnalytics(d); })
      .catch(e => console.error("Error fetching analytics:", e));

    fetch('http://127.0.0.1:8000/heatmap')
      .then(r => r.json())
      .then(d => { if (d && d.matrix) setHeatmap(d); })
      .catch(e => console.error("Error fetching heatmap:", e));
  }, []);

  const DAYS    = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const HOURS   = Array.from({ length: 18 }, (_, i) => i + 6); // 6..23
  const DENSITY_DIST  = analytics.density_dist;
  const VEHICLE_TYPES = analytics.vehicle_types;

  // Build lookup: day+hour -> full item {avg, density, label, short}
  const lookup = {};
  heatmap.matrix.forEach(item => {
    lookup[`${item.day}_${item.hour}`] = item;
  });
  const maxAvg = heatmap.max_avg || 22;
  const isModelSource = heatmap.source === 'model';

  // Color scale: 0 -> cool blue/slate, max -> fiery red
  function getColor(avg) {
    if (avg === 0) return { bg: 'rgba(241,245,249,0.6)', text: '#94a3b8' }; // slate-100
    const ratio = Math.min(avg / maxAvg, 1);
    // Interpolate: low=indigo, mid=amber, high=red
    let r, g, b;
    if (ratio < 0.4) {
      // indigo → green
      const t = ratio / 0.4;
      r = Math.round(99  + t * (34  - 99));   // 99→34
      g = Math.round(102 + t * (197 - 102));  // 102→197
      b = Math.round(241 + t * (94  - 241));  // 241→94
    } else if (ratio < 0.7) {
      // green → amber
      const t = (ratio - 0.4) / 0.3;
      r = Math.round(34  + t * (245 - 34));
      g = Math.round(197 + t * (158 - 197));
      b = Math.round(94  + t * (11  - 94));
    } else {
      // amber → red
      const t = (ratio - 0.7) / 0.3;
      r = Math.round(245 + t * (220 - 245));
      g = Math.round(158 + t * (38  - 158));
      b = Math.round(11  + t * (38  - 11));
    }
    const alpha = 0.25 + ratio * 0.75;
    const textColor = ratio > 0.5 ? '#fff' : '#1e293b';
    return { bg: `rgba(${r},${g},${b},${alpha})`, text: textColor };
  }

  function getDensityLabel(item) {
    if (!item) return 'Tidak ada data';
    // If model-sourced, use label field directly
    if (item.label) return item.label;
    const avg = item.avg ?? item;
    if (avg === 0)  return 'Tidak ada data';
    if (avg < 5)   return 'Kosong';
    if (avg < 8)   return 'Sepi';
    if (avg < 12)  return 'Sedang';
    if (avg < 18)  return 'Padat';
    return 'Macet';
  }

  return (
    <div className="space-y-6">
      {/* ── Heatmap ── */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Rata-rata Kendaraan per Jam</h3>
            <p className="text-xs text-slate-500">Prediksi AI — Senin s/d Minggu, Jam 06:00–23:00</p>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: '640px' }}>
            {/* Hour labels row */}
            <div className="flex">
              {/* Day label spacer */}
              <div style={{ width: '68px', flexShrink: 0 }} />
              {HOURS.map(h => (
                <div
                  key={h}
                  className="flex-1 text-center text-xs font-mono text-slate-400 pb-1"
                  style={{ minWidth: '32px' }}
                >
                  {String(h).padStart(2,'0')}
                </div>
              ))}
            </div>

            {/* Rows: one per day */}
            {DAYS.map(day => (
              <div key={day} className="flex items-center mb-1">
                <div
                  className="text-xs font-medium text-slate-600 pr-2 text-right"
                  style={{ width: '68px', flexShrink: 0 }}
                >
                  {day}
                </div>
                {HOURS.map(h => {
                  const item = lookup[`${day}_${h}`] ?? null;
                  const avg  = item?.avg ?? 0;
                  const short = item?.short ?? '';
                  const { bg, text } = getColor(avg);
                  return (
                    <div
                      key={h}
                      className="flex-1 relative cursor-pointer transition-transform duration-150 hover:scale-110 hover:z-10"
                      style={{ minWidth: '34px', height: '34px', margin: '1px' }}
                      onMouseEnter={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({ day, hour: h, item, rect });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <div
                        className="w-full h-full rounded-md flex items-center justify-center text-xs font-bold tracking-tight"
                        style={{ backgroundColor: bg, color: text }}
                      >
                        {avg > 0 ? (isModelSource ? short : avg) : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* X-axis label */}
            <div className="flex mt-1">
              <div style={{ width: '68px', flexShrink: 0 }} />
              <p className="flex-1 text-xs text-slate-400 text-center">Jam (WIB)</p>
            </div>
          </div>
        </div>

        {/* Color scale legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Kategori:</span>
          {[
            { label: 'K — Kosong',  color: 'rgba(99,102,241,0.35)',  score: 2  },
            { label: 'S — Sepi',   color: 'rgba(34,197,94,0.65)',   score: 6  },
            { label: 'Sd — Sedang', color: 'rgba(245,158,11,0.85)', score: 11 },
            { label: 'P — Padat',  color: 'rgba(239,68,68,0.85)',   score: 16 },
            { label: 'M — Macet',  color: 'rgba(185,28,28,1)',      score: 22 },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-sm inline-block border border-white/20" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
          {isModelSource && (
            <span className="ml-auto text-xs text-brand-500 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Prediksi Model AI
            </span>
          )}
        </div>
      </div>

      {/* Tooltip portal */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: tooltip.rect ? tooltip.rect.top - 80 : 0,
            left: tooltip.rect ? tooltip.rect.left + tooltip.rect.width / 2 : 0,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2.5 shadow-xl whitespace-nowrap">
            <div className="font-semibold mb-0.5">{tooltip.day} — {String(tooltip.hour).padStart(2,'0')}:00–{String(tooltip.hour+1).padStart(2,'0')}:00</div>
            {isModelSource ? (
              <div className="text-slate-300">
                Prediksi: <span className="text-white font-bold">{getDensityLabel(tooltip.item)}</span>
              </div>
            ) : (
              <div className="text-slate-300">
                Rata-rata: <span className="text-white font-bold">{tooltip.item?.avg ?? 0}</span> kendaraan/frame
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
          </div>
        </div>
      )}

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
