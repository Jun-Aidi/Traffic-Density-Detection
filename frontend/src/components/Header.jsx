import { useEffect, useState } from 'react';

export default function Header({ title, subtitle, gradient = 'from-brand-500 to-indigo-500' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = time.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-1">
          <div
            className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${gradient}`}
          />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-2 ml-[18px]">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-medium">{dateStr}</p>
            <p className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
              {time.toLocaleTimeString('id-ID')}
            </p>
          </div>
        </div>

        {/* Notification bell (decorative) */}
        <button className="hidden md:flex w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 items-center justify-center hover:bg-white hover:shadow-md transition-all group">
          <svg
            className="w-5 h-5 text-slate-500 group-hover:text-brand-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Profile chip */}
        <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3 py-2 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            A
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Admin</p>
            <p className="text-[10px] text-slate-400">TrafficSense</p>
          </div>
        </div>
      </div>
    </header>
  );
}
