const BADGE_MAP = {
  Empty:  'badge badge-empty',
  Low:    'badge badge-low',
  Medium: 'badge badge-medium',
  High:   'badge badge-high',
  Heavy:  'badge badge-heavy',
};

const LABEL_MAP = {
  Empty: 'Kosong', Low: 'Sepi', Medium: 'Sedang', High: 'Padat', Heavy: 'Macet',
};

const SAMPLE_DATA = [
  { day: 'Senin',  hour: '06', minute: '08', density: 'Empty',  total: 5,  time: '2026-06-01 06:08' },
  { day: 'Senin',  hour: '08', minute: '39', density: 'Medium', total: 21, time: '2026-06-01 08:39' },
  { day: 'Selasa', hour: '09', minute: '51', density: 'Medium', total: 21, time: '2026-06-02 09:51' },
  { day: 'Selasa', hour: '07', minute: '12', density: 'Low',    total: 9,  time: '2026-06-02 07:12' },
  { day: 'Rabu',   hour: '17', minute: '30', density: 'High',   total: 18, time: '2026-06-04 17:30' },
  { day: 'Kamis',  hour: '06', minute: '15', density: 'Empty',  total: 3,  time: '2026-05-28 06:15' },
  { day: 'Kamis',  hour: '08', minute: '05', density: 'High',   total: 20, time: '2026-05-28 08:05' },
  { day: 'Jumat',  hour: '17', minute: '15', density: 'Heavy',  total: 26, time: '2026-05-29 17:15' },
  { day: 'Sabtu',  hour: '10', minute: '09', density: 'Medium', total: 22, time: '2026-05-30 10:09' },
  { day: 'Minggu', hour: '09', minute: '00', density: 'Low',    total: 8,  time: '2026-06-07 09:00' },
];

export default function HistoryPage({ extraHistory = [] }) {
  const allData = [
    ...extraHistory.map(h => ({
      day: h.day,
      hour: h.hour,
      minute: h.minute,
      density: h.density,
      total: '—',
      time: h.timestamp?.toLocaleString('id-ID') ?? '—',
    })).reverse(),
    ...SAMPLE_DATA,
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800">Riwayat Data Lalu Lintas</h3>
          <p className="text-xs text-slate-400 mt-0.5">{allData.length} rekaman tersimpan</p>
        </div>
        <span className="text-xs bg-brand-50 text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg font-medium">
          7 Hari Terakhir
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hari</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kepadatan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kendaraan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {allData.map((row, i) => (
              <tr key={i} className="table-row">
                <td className="px-6 py-4 text-sm text-slate-800 font-medium">{row.day}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-600">{row.hour}:{row.minute}</td>
                <td className="px-6 py-4">
                  <span className={BADGE_MAP[row.density] || 'badge badge-empty'}>
                    {LABEL_MAP[row.density] || row.density}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{row.total}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
