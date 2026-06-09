import { useState, useEffect } from 'react';

const ACCENT = {
  brand: { icon: 'text-brand-600 bg-brand-50', value: 'text-brand-600' },
  amber: { icon: 'text-amber-600 bg-amber-50', value: 'text-amber-600' },
  green: { icon: 'text-green-600 bg-green-50', value: 'text-green-600' },
  cyan: { icon: 'text-cyan-600 bg-cyan-50', value: 'text-cyan-600' },
};

const RECENT = [
  { day: 'Jumat', time: '17:15', density: 'Macet', badge: 'badge badge-heavy', advice: 'Hindari jam pulang kerja' },
  { day: 'Senin', time: '08:39', density: 'Sedang', badge: 'badge badge-medium', advice: 'Jam sekolah dan kerja' },
  { day: 'Sabtu', time: '10:09', density: 'Sedang', badge: 'badge badge-medium', advice: 'Aktivitas akhir pekan' },
  { day: 'Kamis', time: '08:05', density: 'Padat', badge: 'badge badge-high', advice: 'Rush hour pagi' },
];

export default function DashboardPage() {
  const [statsData, setStatsData] = useState({
    total: '...',
    dominant: '...',
    busiest: '...'
  });

  const [currentStatus, setCurrentStatus] = useState({
    label: 'Memuat...',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200'
  });

  const [highlights, setHighlights] = useState([]);

  const [weather, setWeather] = useState({
    temp: '...',
    desc: 'Memuat...',
    icon: '☁️'
  });

  useEffect(() => {
    // 1. Fetch Stats
    fetch('http://127.0.0.1:8000/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.total_data) {
          setStatsData({
            total: data.total_data,
            dominant: data.dominant_vehicle,
            busiest: data.busiest_hour
          });
          if (data.highlights) {
            setHighlights(data.highlights);
          }
        }
      })
      .catch(err => console.error("Error fetching stats:", err));

    // 2. Fetch Real-time Prediction for "Status Saat Ini"
    const now = new Date();
    // JS getDay(): 0=Minggu, 1=Senin. Model: 0=Senin, 6=Minggu.
    const dayMapping = [6, 0, 1, 2, 3, 4, 5];
    const currentDay = dayMapping[now.getDay()];

    fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: currentDay,
        hour: now.getHours(),
        minute: now.getMinutes()
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.density) {
          const densityMapping = {
            Empty: { label: 'Kosong', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300' },
            Low: { label: 'Sepi', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
            Medium: { label: 'Sedang', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
            High: { label: 'Padat', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
            Heavy: { label: 'Macet', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
          };
          setCurrentStatus(densityMapping[data.density] || densityMapping.Empty);
        }
      })
      .catch(err => console.error("Error fetching current prediction:", err));

    // 3. Fetch Weather Data
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          const code = data.current_weather.weathercode;
          let desc = 'Cerah';
          let icon = '☀️';
          if (code >= 1 && code <= 3) { desc = 'Berawan'; icon = '⛅'; }
          else if (code >= 45 && code <= 48) { desc = 'Berkabut'; icon = '🌫️'; }
          else if (code >= 51 && code <= 67) { desc = 'Hujan Ringan'; icon = '🌧️'; }
          else if (code >= 71 && code <= 77) { desc = 'Salju'; icon = '❄️'; }
          else if (code >= 80 && code <= 82) { desc = 'Hujan Deras'; icon = '🌧️'; }
          else if (code >= 95 && code <= 99) { desc = 'Badai Petir'; icon = '⛈️'; }
          
          setWeather({
            temp: `${Math.round(data.current_weather.temperature)}°C`,
            desc,
            icon
          });
        }
      })
      .catch(err => console.error("Error fetching weather:", err));
  }, []);

  const STATS = [
    {
      label: 'Total Data Direkam',
      value: statsData.total,
      sub: '06:00 – 00:00',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      accent: 'brand',
    },
    {
      label: 'Jam Tersibuk',
      value: statsData.busiest,
      sub: 'Berdasarkan rata-rata',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'amber',
    },

    {
      label: 'Kendaraan Dominan',
      value: statsData.dominant,
      sub: 'Dari total deteksi objek',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 3l-5.447-2.724A1 1 0 0015 5.618v10.764a1 1 0 001.447.894L21 14M15 7v13" />
        </svg>
      ),
      accent: 'cyan',
    },
  ];

  const now = new Date();
  const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((s, i) => {
          const ac = ACCENT[s.accent];
          return (
            <div key={i} className="stat-card flex flex-col gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${ac.icon}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{s.label}</p>
                <p className={`text-2xl font-extrabold ${ac.value}`}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Status + Indicators) */}
        <div className="flex flex-col gap-6">

          {/* Cuaca Widget */}
          <div className="card p-6 flex flex-col gap-3 bg-gradient-to-br from-sky-500 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            {/* Background Icon Detail */}
            <div className="absolute top-[-20%] right-[-10%] p-4 opacity-10 pointer-events-none">
              <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.362 10.929C19.674 10.334 20 9.7 20 9c0-3.314-2.686-6-6-6-2.124 0-3.996 1.107-5.066 2.784A4.985 4.985 0 008 5C5.239 5 3 7.239 3 10c0 2.228 1.458 4.103 3.473 4.757-.021.135-.045.27-.045.41 0 2.667 2.163 4.833 4.833 4.833 2.115 0 3.916-1.353 4.58-3.238.169.016.338.038.512.038 2.608 0 4.72-2.112 4.72-4.72 0-1.042-.338-2.008-.911-2.793v-.358z"/></svg>
            </div>
            
            <div className="relative z-10 flex flex-col">
              <h3 className="text-[11px] font-bold text-sky-100 uppercase tracking-widest mb-3 flex items-center gap-1.5 opacity-90">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Jakarta Pusat
              </h3>
              
              <div className="flex items-center gap-4">
                <span className="text-5xl filter drop-shadow-md">{weather.icon}</span>
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">{weather.temp}</div>
                  <div className="text-sm font-medium text-sky-100 mt-0.5">{weather.desc}</div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-2 pt-3 border-t border-white/20">
              <p className="text-[11px] text-sky-100/90 leading-tight">
                Prediksi cuaca terintegrasi untuk melihat dampak potensi pada volume jalan.
              </p>
            </div>
          </div>

          {/* Current Status */}
          <div className="card p-6 flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Prediksi Saat Ini</h3>

            <div className={`rounded-2xl p-5 text-center border-2 ${currentStatus.bg} ${currentStatus.border}`}>
              <div className={`text-5xl font-black mb-2 ${currentStatus.color}`}>{currentStatus.label}</div>
              <p className="text-xs text-slate-500">Prediksi otomatis berdasarkan jam sekarang</p>
            </div>

            <div className="space-y-0">
              {[
                { label: 'Jam', val: timeStr },
                { label: 'Hari', val: dayName },
                { label: 'Model', val: 'Random Forest' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{r.label}</span>
                  <span className="text-sm text-slate-800 font-semibold">{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indikator Kepadatan */}
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Indikator Kepadatan</h3>
            <div className="space-y-3 mt-1">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="badge badge-empty">Kosong</span><span className="text-sm font-medium text-slate-500">0 - 10 unit</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="badge badge-low">Sepi</span><span className="text-sm font-medium text-slate-500">11 - 20 unit</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="badge badge-medium">Sedang</span><span className="text-sm font-medium text-slate-500">21 - 30 unit</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="badge badge-high">Padat</span><span className="text-sm font-medium text-slate-500">31 - 40 unit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="badge badge-heavy">Macet</span><span className="text-sm font-medium text-slate-500">&gt; 40 unit</span>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Highlights */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Catatan Kepadatan Tertinggi</h3>
              <p className="text-xs text-slate-400 mt-0.5">Data highlight dari rekaman 7 hari</p>
            </div>
            <span className="text-xs bg-brand-50 text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg font-medium">
              7 Hari
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hari</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {highlights.length > 0 ? (
                highlights.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td className="px-6 py-3.5 text-sm text-slate-800 font-medium">{r.day}</td>
                    <td className="px-6 py-3.5 text-sm font-mono text-slate-600">{r.time}</td>
                    <td className="px-6 py-3.5"><span className={r.badge}>{r.density}</span></td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">{r.advice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-sm text-slate-400">Memuat catatan tertinggi...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
