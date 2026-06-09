import { useState, useEffect } from 'react';

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
  const [weather, setWeather] = useState({
    title: 'Cuaca Saat Ini (Jakarta)',
    temp: '...',
    desc: 'Memuat...',
    icon: '☁️'
  });
  const [forecastData, setForecastData] = useState(null);

  function getNextDateStr(dIndex, h) {
    const now = new Date();
    let currentOurDay = now.getDay() === 0 ? 6 : now.getDay() - 1;
    let diff = dIndex - currentOurDay;
    if (diff < 0) diff += 7;
    
    const target = new Date();
    target.setDate(now.getDate() + diff);
    
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const hh = String(h).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:00`;
  }

  function updateWeatherUI(hourly, dIndex, h) {
    if (!hourly) return;
    const targetStr = getNextDateStr(dIndex, h);
    const index = hourly.time.findIndex(t => t === targetStr);
    
    if (index !== -1) {
      const code = hourly.weathercode[index];
      const temp = hourly.temperature_2m[index];
      let desc = 'Cerah'; let icon = '☀️';
      if (code >= 1 && code <= 3) { desc = 'Berawan'; icon = '⛅'; }
      else if (code >= 45 && code <= 48) { desc = 'Berkabut'; icon = '🌫️'; }
      else if (code >= 51 && code <= 67) { desc = 'Hujan Ringan'; icon = '🌧️'; }
      else if (code >= 71 && code <= 77) { desc = 'Salju'; icon = '❄️'; }
      else if (code >= 80 && code <= 82) { desc = 'Hujan Deras'; icon = '🌧️'; }
      else if (code >= 95 && code <= 99) { desc = 'Badai Petir'; icon = '⛈️'; }
      
      const currentOurDay = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
      const isCurrent = (dIndex === currentOurDay) && (h === new Date().getHours());

      setWeather({
        title: isCurrent ? 'Cuaca Saat Ini (Jakarta)' : `Prediksi Cuaca (${DAYS[dIndex]} ${String(h).padStart(2, '0')}:00)`,
        temp: `${Math.round(temp)}°C`,
        desc,
        icon
      });
    }
  }

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&hourly=temperature_2m,weathercode&timezone=Asia%2FJakarta')
      .then(res => res.json())
      .then(data => {
        if (data && data.hourly) {
          setForecastData(data.hourly);
          updateWeatherUI(data.hourly, new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, new Date().getHours());
        }
      })
      .catch(err => console.error("Error fetching weather:", err));
  }, []);

  async function handlePredict(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: parseInt(day),
          hour: parseInt(hour),
          minute: parseInt(minute)
        })
      });
      
      const data = await response.json();
      
      if (data.density) {
        setResult(data.density);
        updateWeatherUI(forecastData, parseInt(day), parseInt(hour));
        onAddHistory?.({ 
          day: DAYS[day], 
          hour, 
          minute, 
          density: data.density, 
          timestamp: new Date() 
        });
      } else {
        // Fallback jika terjadi error
        console.error("API Error:", data);
        setResult('Empty');
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Gagal terhubung ke Backend API! Pastikan server FastAPI (Python) sudah berjalan.");
    } finally {
      setLoading(false);
    }
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
                {Array.from({ length: 18 }, (_, i) => i + 6).map((h) => (
                  <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menit</label>
              <select value={minute} onChange={e => setMinute(e.target.value)} className="form-select max-h-48">
                {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
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

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        
        {/* Cuaca Widget */}
        <div className="card p-6 flex flex-col gap-3 bg-gradient-to-br from-sky-500 to-indigo-600 border-0 shadow-lg shadow-indigo-500/20 relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-[-20%] right-[-10%] p-4 opacity-10 pointer-events-none">
            <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.362 10.929C19.674 10.334 20 9.7 20 9c0-3.314-2.686-6-6-6-2.124 0-3.996 1.107-5.066 2.784A4.985 4.985 0 008 5C5.239 5 3 7.239 3 10c0 2.228 1.458 4.103 3.473 4.757-.021.135-.045.27-.045.41 0 2.667 2.163 4.833 4.833 4.833 2.115 0 3.916-1.353 4.58-3.238.169.016.338.038.512.038 2.608 0 4.72-2.112 4.72-4.72 0-1.042-.338-2.008-.911-2.793v-.358z"/></svg>
          </div>
          
          <div className="relative z-10 flex flex-col">
            <h3 className="text-[11px] font-bold text-sky-100 uppercase tracking-widest mb-3 flex items-center gap-1.5 opacity-90">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {weather.title}
            </h3>
            
            <div className="flex items-center gap-4">
              <span className="text-5xl filter drop-shadow-md">{weather.icon}</span>
              <div>
                <div className="text-3xl font-black text-white tracking-tight">{weather.temp}</div>
                <div className="text-sm font-medium text-sky-100 mt-0.5">{weather.desc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="card p-6 flex flex-col flex-1">
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
    </div>
  );
}
