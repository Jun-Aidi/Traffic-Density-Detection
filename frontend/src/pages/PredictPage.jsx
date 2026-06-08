import { useState } from 'react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const DENSITY_LEVELS = {
  Empty:  { label: 'Kosong', color: 'text-slate-600',  bg: 'bg-slate-100', border: 'border-slate-300',  dot: 'bg-slate-400',  advice: 'Lalu lintas sangat lengang. Waktu terbaik untuk perjalanan!' },
  Low:    { label: 'Sepi',   color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500',  advice: 'Kondisi lalu lintas baik. Perjalanan Anda akan lancar.' },
  Medium: { label: 'Sedang', color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500',  advice: 'Kepadatan sedang. Tambahkan 5–10 menit buffer waktu Anda.' },
  High:   { label: 'Padat',  color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500', advice: 'Kepadatan tinggi. Pertimbangkan untuk berangkat lebih awal.' },
  Heavy:  { label: 'Macet',  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-500',    advice: 'Kemacetan parah! Disarankan tunda perjalanan 1–2 jam.' },
};

function simulatePredict(day, hour) {
  const h = parseInt(hour);
  const d = parseInt(day);
  if (d < 5) {
    if (h >= 7 && h <= 9)   return 'Heavy';
    if (h >= 16 && h <= 18) return 'High';
    if (h >= 10 && h <= 15) return 'Medium';
    if (h >= 6 && h < 7)    return 'Low';
    return 'Empty';
  }
  if (h >= 9 && h <= 14)  return 'Medium';
  if (h >= 15 && h <= 17) return 'Low';
  return 'Empty';
}

export default function PredictPage({ onAddHistory }) {
  const [day, setDay] = useState('0');
  const [hour, setHour] = useState('8');
  const [minute, setMinute] = useState('00');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handlePredict(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const pred = simulatePredict(day, hour);
      setResult(pred);
      setLoading(false);
      onAddHistory?.({ day: DAYS[day], hour, minute, density: pred, timestamp: new Date() });
    }, 1400);
  }

  const info = result ? DENSITY_LEVELS[result] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Mesin Prediksi</h3>
            <p className="text-xs text-slate-500">Prediksi kepadatan berdasarkan waktu</p>
          </div>
        </div>

        <form onSubmit={handlePredict} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hari</label>
            <select value={day} onChange={e => setDay(e.target.value)} className="form-select">
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Jam</label>
              <select value={hour} onChange={e => setHour(e.target.value)} className="form-select">
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menit</label>
              <select value={minute} onChange={e => setMinute(e.target.value)} className="form-select">
                {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Preview bar */}
          <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 flex items-center gap-3">
            <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{DAYS[day]}</span>
              {' pukul '}
              <span className="font-mono font-semibold text-brand-600">
                {hour.toString().padStart(2, '0')}:{minute}
              </span>
            </span>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Jalankan Prediksi
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Card */}
      <div className="card p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Hasil Prediksi</h3>
            <p className="text-xs text-slate-500">Output model AI</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm animate-pulse">Menganalisa pola data...</p>
            </div>
          ) : result && info ? (
            <div className={`w-full rounded-2xl border-2 p-6 text-center ${info.bg} ${info.border}`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${info.dot}`} />
                <span className={`text-4xl font-extrabold tracking-tight ${info.color}`}>{info.label}</span>
              </div>
              <p className={`text-sm mb-5 ${info.color} opacity-80`}>{info.advice}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border ${info.border}`}>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`text-sm font-medium ${info.color}`}>
                  {DAYS[day]}, {hour.toString().padStart(2, '0')}:{minute}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-40">
              <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-slate-400 text-sm">Pilih hari dan jam, lalu<br />jalankan prediksi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
