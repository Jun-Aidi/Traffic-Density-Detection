import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import PredictPage from './pages/PredictPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';

const PAGE_META = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Ringkasan sistem prediksi lalu lintas real-time',
    gradient: 'from-brand-500 to-indigo-500',
  },
  predict: {
    title: 'Prediksi Lalu Lintas',
    subtitle: 'Masukkan parameter waktu untuk mendapatkan prediksi AI',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  history: {
    title: 'Riwayat Data',
    subtitle: 'Data historis yang direkam dari lapangan',
    gradient: 'from-sky-500 to-cyan-500',
  },
  analytics: {
    title: 'Analitik',
    subtitle: 'Visualisasi pola kepadatan lalu lintas',
    gradient: 'from-emerald-500 to-teal-500',
  },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [history, setHistory] = useState([]);

  function handleAddHistory(entry) {
    setHistory(prev => [entry, ...prev].slice(0, 50));
  }

  const meta = PAGE_META[activePage] ?? PAGE_META.dashboard;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-brand-50/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
        <Header title={meta.title} subtitle={meta.subtitle} gradient={meta.gradient} />

        <div key={activePage} className="animate-fade-in-up">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'predict' && (
            <PredictPage onAddHistory={handleAddHistory} />
          )}
          {activePage === 'history' && <HistoryPage extraHistory={history} />}
          {activePage === 'analytics' && <AnalyticsPage />}
        </div>
      </main>
    </div>
  );
}
