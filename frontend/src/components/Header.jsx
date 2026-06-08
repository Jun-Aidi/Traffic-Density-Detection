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

        {/* Notification */}
        <button className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-brand-400 flex items-center justify-center text-slate-400 hover:text-brand-500 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
