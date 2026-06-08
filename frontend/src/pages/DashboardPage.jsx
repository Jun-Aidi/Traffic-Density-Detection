const STATS = [
  {
    label: 'Total Data Direkam',
    value: '90.025',
    sub: '7 hari | 06:00 – 00:00',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    accent: 'brand',
  },
  {
    label: 'Jam Tersibuk',
    value: '07:00 – 09:00',
    sub: 'Rata-rata 21 kendaraan/frame',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: 'amber',
  },
  {
    label: 'Akurasi Model',
    value: '~82%',
    sub: 'Random Forest Classifier',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: 'green',
  },
  {
    label: 'Kendaraan Dominan',
    value: 'Sepeda Motor',
    sub: 'Kolom C2 paling banyak terdeteksi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m6 3l-5.447-2.724A1 1 0 0015 5.618v10.764a1 1 0 001.447.894L21 14M15 7v13" />
      </svg>
    ),
    accent: 'cyan',
  },
];

const ACCENT = {
  brand: { icon: 'text-brand-600 bg-brand-50',  value: 'text-brand-600' },
  amber: { icon: 'text-amber-600 bg-amber-50',  value: 'text-amber-600' },
  green: { icon: 'text-green-600 bg-green-50',  value: 'text-green-600' },
  cyan:  { icon: 'text-cyan-600 bg-cyan-50',    value: 'text-cyan-600'  },
};

const RECENT = [
  { day: 'Jumat',  time: '17:15', density: 'Macet',  badge: 'badge badge-heavy',  advice: 'Hindari jam pulang kerja' },
  { day: 'Senin',  time: '08:39', density: 'Sedang', badge: 'badge badge-medium', advice: 'Jam sekolah dan kerja' },
  { day: 'Sabtu',  time: '10:09', density: 'Sedang', badge: 'badge badge-medium', advice: 'Aktivitas akhir pekan' },
  { day: 'Kamis',  time: '08:05', density: 'Padat',  badge: 'badge badge-high',   advice: 'Rush hour pagi' },
  { day: 'Minggu', time: '09:00', density: 'Sepi',   badge: 'badge badge-low',    advice: 'Pagi akhir pekan tenang' },
];

function getCurrentStatus() {
  const h = new Date().getHours();
  if (h >= 7 && h <= 9)   return { label: 'Macet',  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' };
  if (h >= 16 && h <= 18) return { label: 'Padat',  color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
  if (h >= 10 && h <= 15) return { label: 'Sedang', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' };
  if (h >= 6 && h < 7)    return { label: 'Sepi',   color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' };
  return                           { label: 'Kosong', color: 'text-slate-600',  bg: 'bg-slate-100', border: 'border-slate-200' };
}

export default function DashboardPage() {
  const now = new Date();
  const dayName = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][now.getDay()];
  const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  const status = getCurrentStatus();

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
        {/* Current Status */}
        <div className="card p-6 flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Status Saat Ini</h3>

          <div className={`rounded-2xl p-5 text-center border-2 ${status.bg} ${status.border}`}>
            <div className={`text-5xl font-black mb-2 ${status.color}`}>{status.label}</div>
            <p className="text-xs text-slate-500">Prediksi otomatis berdasarkan jam sekarang</p>
          </div>

          <div className="space-y-0">
            {[
              { label: 'Jam',   val: timeStr },
              { label: 'Hari',  val: dayName },
              { label: 'Model', val: 'Random Forest' },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{r.label}</span>
                <span className="text-sm text-slate-800 font-semibold">{r.val}</span>
              </div>
            ))}
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
              {RECENT.map((r, i) => (
                <tr key={i} className="table-row">
                  <td className="px-6 py-3.5 text-sm text-slate-800 font-medium">{r.day}</td>
                  <td className="px-6 py-3.5 text-sm font-mono text-slate-600">{r.time}</td>
                  <td className="px-6 py-3.5"><span className={r.badge}>{r.density}</span></td>
                  <td className="px-6 py-3.5 text-xs text-slate-400">{r.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
