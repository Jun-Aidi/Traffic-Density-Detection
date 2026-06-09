import { useState, useEffect } from 'react';

// Vehicle icons as inline SVG components
const VehicleIcon = {
  motor: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 7h-3V5.5A2.5 2.5 0 0013.5 3h-3A2.5 2.5 0 008 5.5V7H5a2 2 0 00-2 2v2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3V9a2 2 0 00-2-2zM7 11a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  car: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  ),
  bus: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
    </svg>
  ),
  truck: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  ),
  bicycle: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5S3.07 13.5 5 13.5s3.5 1.57 3.5 3.5S6.93 20.5 5 20.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </svg>
  ),
};

// Map label to icon and gradient color
const VEHICLE_META = {
  'Sepeda Motor': {
    icon: VehicleIcon.motor,
    gradient: 'from-brand-400 to-brand-600',
    solid: 'bg-brand-500',
    text: 'text-brand-600',
    bg: 'bg-brand-50',
    ring: 'ring-brand-200',
    stackColor: '#6366f1',
  },
  'Mobil': {
    icon: VehicleIcon.car,
    gradient: 'from-cyan-400 to-sky-600',
    solid: 'bg-cyan-500',
    text: 'text-cyan-600',
    bg: 'bg-cyan-50',
    ring: 'ring-cyan-200',
    stackColor: '#06b6d4',
  },
  'Bus': {
    icon: VehicleIcon.bus,
    gradient: 'from-amber-400 to-orange-500',
    solid: 'bg-amber-500',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    stackColor: '#f59e0b',
  },
  'Truk': {
    icon: VehicleIcon.truck,
    gradient: 'from-orange-400 to-red-500',
    solid: 'bg-orange-500',
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    ring: 'ring-orange-200',
    stackColor: '#f97316',
  },
  'Sepeda': {
    icon: VehicleIcon.bicycle,
    gradient: 'from-emerald-400 to-green-600',
    solid: 'bg-emerald-500',
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    stackColor: '#10b981',
  },
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    hour_data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    density_dist: [],
    vehicle_types: [],
  });

  const [heatmap, setHeatmap] = useState({
    matrix: [],
    days: [],
    hours: [],
    max_avg: 1,
  });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/analytics')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.hour_data) setAnalytics(d);
      })
      .catch((e) => console.error('Error fetching analytics:', e));

    fetch('http://127.0.0.1:8000/heatmap')
      .then((r) => r.json())
      .then((d) => {
        if (d && d.matrix) setHeatmap(d);
      })
      .catch((e) => console.error('Error fetching heatmap:', e));
  }, []);

  const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
  const DENSITY_DIST = analytics.density_dist;
  const VEHICLE_TYPES = analytics.vehicle_types;

  // Total vehicles count (sum of pct as proxy, or use actual)
  const totalPct = VEHICLE_TYPES.reduce((s, v) => s + v.pct, 0);

  // Build lookup: day+hour -> full item
  const lookup = {};
  heatmap.matrix.forEach((item) => {
    lookup[`${item.day}_${item.hour}`] = item;
  });
  const maxAvg = heatmap.max_avg || 22;
  const isModelSource = heatmap.source === 'model';

  function getColor(avg) {
    if (avg === 0) return { bg: 'rgba(241,245,249,0.6)', text: '#94a3b8' };
    const ratio = Math.min(avg / maxAvg, 1);
    let r, g, b;
    if (ratio < 0.4) {
      const t = ratio / 0.4;
      r = Math.round(99 + t * (34 - 99));
      g = Math.round(102 + t * (197 - 102));
      b = Math.round(241 + t * (94 - 241));
    } else if (ratio < 0.7) {
      const t = (ratio - 0.4) / 0.3;
      r = Math.round(34 + t * (245 - 34));
      g = Math.round(197 + t * (158 - 197));
      b = Math.round(94 + t * (11 - 94));
    } else {
      const t = (ratio - 0.7) / 0.3;
      r = Math.round(245 + t * (220 - 245));
      g = Math.round(158 + t * (38 - 158));
      b = Math.round(11 + t * (38 - 11));
    }
    const alpha = 0.25 + ratio * 0.75;
    const textColor = ratio > 0.5 ? '#fff' : '#1e293b';
    return { bg: `rgba(${r},${g},${b},${alpha})`, text: textColor };
  }

  function getDensityLabel(item) {
    if (!item) return 'Tidak ada data';
    if (item.label) return item.label;
    const avg = item.avg ?? item;
    if (avg === 0) return 'Tidak ada data';
    if (avg < 5) return 'Kosong';
    if (avg < 8) return 'Sepi';
    if (avg < 12) return 'Sedang';
    if (avg < 18) return 'Padat';
    return 'Macet';
  }

  // Density badge colors
  const densityBarColors = {
    'bg-slate-400': 'from-slate-300 to-slate-500',
    'bg-green-500': 'from-emerald-400 to-green-600',
    'bg-amber-500': 'from-amber-400 to-yellow-500',
    'bg-orange-500': 'from-orange-400 to-red-500',
    'bg-red-500': 'from-red-400 to-red-600',
  };

  return (
    <div className="space-y-6">
      {/* ── Heatmap ── */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Rata-rata Kendaraan per Jam</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prediksi AI — Senin s/d Minggu, Jam 06:00–23:00
            </p>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: '640px' }}>
            {/* Hour labels row */}
            <div className="flex">
              <div style={{ width: '68px', flexShrink: 0 }} />
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="flex-1 text-center text-xs font-mono text-slate-400 pb-1"
                  style={{ minWidth: '32px' }}
                >
                  {String(h).padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Rows: one per day */}
            {DAYS.map((day) => (
              <div key={day} className="flex items-center mb-1">
                <div
                  className="text-xs font-medium text-slate-600 pr-2 text-right"
                  style={{ width: '68px', flexShrink: 0 }}
                >
                  {day}
                </div>
                {HOURS.map((h) => {
                  const item = lookup[`${day}_${h}`] ?? null;
                  const avg = item?.avg ?? 0;
                  const short = item?.short ?? '';
                  const { bg, text } = getColor(avg);
                  return (
                    <div
                      key={h}
                      className="flex-1 relative cursor-pointer transition-transform duration-150 hover:scale-110 hover:z-10"
                      style={{ minWidth: '34px', height: '34px', margin: '1px' }}
                      onMouseEnter={(e) => {
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
            { label: 'K — Kosong', color: 'rgba(99,102,241,0.35)' },
            { label: 'S — Sepi', color: 'rgba(34,197,94,0.65)' },
            { label: 'Sd — Sedang', color: 'rgba(245,158,11,0.85)' },
            { label: 'P — Padat', color: 'rgba(239,68,68,0.85)' },
            { label: 'M — Macet', color: 'rgba(185,28,28,1)' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-sm inline-block border border-white/20"
                style={{ backgroundColor: color }}
              />
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
            <div className="font-semibold mb-0.5">
              {tooltip.day} — {String(tooltip.hour).padStart(2, '0')}:00–
              {String(tooltip.hour + 1).padStart(2, '0')}:00
            </div>
            {isModelSource ? (
              <div className="text-slate-300">
                Prediksi:{' '}
                <span className="text-white font-bold">
                  {getDensityLabel(tooltip.item)}
                </span>
              </div>
            ) : (
              <div className="text-slate-300">
                Rata-rata:{' '}
                <span className="text-white font-bold">
                  {tooltip.item?.avg ?? 0}
                </span>{' '}
                kendaraan/frame
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
          </div>
        </div>
      )}

      {/* ── Bottom row: Density + Vehicle Composition ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Density Distribution ── */}
        <div className="card p-6 animate-fade-in-up delay-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Distribusi Kepadatan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Persentase kemunculan setiap kategori</p>
            </div>
          </div>

          <div className="space-y-5">
            {DENSITY_DIST.map((d, i) => {
              const gradColor = densityBarColors[d.color] || 'from-slate-300 to-slate-500';
              return (
                <div key={d.label} className={`animate-fade-in-up delay-${i + 1}`}>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-700 font-semibold flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${gradColor}`}
                      />
                      {d.label}
                    </span>
                    <span className="text-slate-800 font-bold text-base tabular-nums">
                      {d.count}
                      <span className="text-slate-400 font-medium text-sm">%</span>
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill bg-gradient-to-r ${gradColor}`}
                      style={{ width: `${d.count}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Vehicle Type Composition (OVERHAULED) ── */}
        <div className="card p-6 animate-fade-in-up delay-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 3l-5.447-2.724A1 1 0 0015 5.618v10.764a1 1 0 001.447.894L21 14M15 7v13" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-base">Komposisi Kendaraan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berdasarkan deteksi selama 7 hari
                </p>
              </div>
            </div>
          </div>

          {/* ═══ STACKED BAR ═══ */}
          {VEHICLE_TYPES.length > 0 && (
            <div className="mb-6">
              <div className="stacked-bar">
                {VEHICLE_TYPES.map((v, i) => {
                  const meta = VEHICLE_META[v.label] || VEHICLE_META['Mobil'];
                  return (
                    <div
                      key={v.label}
                      className="stacked-bar-segment"
                      style={{
                        width: `${v.pct}%`,
                        backgroundColor: meta.stackColor,
                        animationDelay: `${i * 0.1}s`,
                      }}
                      title={`${v.label}: ${v.pct}%`}
                    >
                      {/* Show label only if segment is wide enough */}
                      {v.pct >= 8 && (
                        <span className="flex items-center gap-1 text-[11px] truncate px-1">
                          {v.pct}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Mini legend under stacked bar */}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {VEHICLE_TYPES.map((v) => {
                  const meta = VEHICLE_META[v.label] || VEHICLE_META['Mobil'];
                  return (
                    <div key={v.label} className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: meta.stackColor }}
                      />
                      <span className="text-[11px] text-slate-500 font-medium">
                        {v.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ INDIVIDUAL DETAIL CARDS ═══ */}
          <div className="space-y-3">
            {VEHICLE_TYPES.map((v, i) => {
              const meta = VEHICLE_META[v.label] || VEHICLE_META['Mobil'];
              return (
                <div
                  key={v.label}
                  className={`group flex items-center gap-4 p-3 rounded-xl hover:${meta.bg} transition-colors duration-200 animate-slide-in-right delay-${i + 1}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    {meta.icon}
                  </div>

                  {/* Info + Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold text-slate-700 truncate">
                        {v.label}
                      </span>
                      <span className={`text-sm font-bold tabular-nums ${meta.text}`}>
                        {v.pct}
                        <span className="text-slate-400 font-normal text-xs">%</span>
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill bg-gradient-to-r ${meta.gradient}`}
                        style={{ width: `${v.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {VEHICLE_TYPES.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
              <svg className="w-16 h-16 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 3l-5.447-2.724A1 1 0 0015 5.618v10.764a1 1 0 001.447.894L21 14M15 7v13" />
              </svg>
              <p className="text-sm text-slate-400">Belum ada data kendaraan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
