import { useState, useEffect } from 'react';

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

export default function HistoryPage({ extraHistory = [] }) {
  const [savedHistory, setSavedHistory] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/history')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSavedHistory(data);
        }
      })
      .catch(err => console.error("Error fetching history:", err));
  }, []);

  const allData = [
    ...extraHistory.map(h => ({
      day: h.day,
      hour: h.hour,
      minute: h.minute,
      density: h.density,
      total: '—',
      time: h.timestamp?.toLocaleString('id-ID') ?? '—',
    })).reverse(),
    ...savedHistory,
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
