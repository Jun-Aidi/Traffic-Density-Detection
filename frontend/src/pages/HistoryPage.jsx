import { useState, useEffect } from 'react';

const BADGE_MAP = {
  Empty: 'badge badge-empty',
  Low: 'badge badge-low',
  Medium: 'badge badge-medium',
  High: 'badge badge-high',
  Heavy: 'badge badge-heavy',
};

const LABEL_MAP = {
  Empty: 'Kosong',
  Low: 'Sepi',
  Medium: 'Sedang',
  High: 'Padat',
  Heavy: 'Macet',
};

export default function HistoryPage({ extraHistory = [] }) {
  const [savedHistory, setSavedHistory] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedHistory(data);
        }
      })
      .catch((err) => console.error('Error fetching history:', err));
  }, []);

  const allData = [
    ...extraHistory
      .map((h) => ({
        day: h.day,
        hour: h.hour,
        minute: h.minute,
        density: h.density,
        total: '—',
        time: h.timestamp?.toLocaleString('id-ID') ?? '—',
      }))
      .reverse(),
    ...savedHistory,
  ];

  return (
    <div className="card overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Riwayat Data Lalu Lintas</h3>
            <p className="text-xs text-slate-400 mt-0.5">{allData.length} rekaman tersimpan</p>
          </div>
        </div>
        <span className="text-xs bg-brand-50 text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg font-semibold">
          7 Hari Terakhir
        </span>
      </div>

      {allData.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 opacity-60">
          <svg
            className="w-20 h-20 text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-slate-400 font-medium">Belum ada data riwayat</p>
          <p className="text-xs text-slate-400 mt-1">
            Jalankan prediksi untuk mulai merekam data
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hari
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Kepadatan
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Kendaraan
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {allData.map((row, i) => (
                <tr key={i} className="table-row">
                  <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{row.day}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 font-medium">
                    {row.hour}:{row.minute}
                  </td>
                  <td className="px-6 py-4">
                    <span className={BADGE_MAP[row.density] || 'badge badge-empty'}>
                      {LABEL_MAP[row.density] || row.density}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.total}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
