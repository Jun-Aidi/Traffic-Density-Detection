import { useEffect, useState } from 'react';

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse flex-shrink-0"></div>
          <div className="text-right">
            <p className="text-xs text-slate-400">{dateStr}</p>
            <p className="text-sm font-mono font-semibold text-slate-700">
              {time.toLocaleTimeString('id-ID')}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
