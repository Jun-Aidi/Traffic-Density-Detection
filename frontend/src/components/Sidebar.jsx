import { useState } from 'react';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'predict',
    label: 'Prediksi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'Riwayat Data',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analitik',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-800 leading-tight">TrafficSense</h1>
          <p className="text-xs text-slate-400">AI Prediction System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">Menu Utama</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`sidebar-link ${activePage === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer user info */}
      <div className="px-4 py-4 border-t border-slate-200">
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            F
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">Fahrezi</p>
            <p className="text-xs text-slate-400 truncate">Mahasiswa IoT</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
