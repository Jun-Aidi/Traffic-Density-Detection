import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import PredictPage from './pages/PredictPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';

const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan sistem prediksi lalu lintas' },
  predict:   { title: 'Prediksi Lalu Lintas', subtitle: 'Masukkan parameter waktu untuk mendapatkan prediksi AI' },
  history:   { title: 'Riwayat Data', subtitle: 'Data historis yang direkam dari lapangan' },
  analytics: { title: 'Analitik', subtitle: 'Visualisasi pola kepadatan lalu lintas' },
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [history, setHistory] = useState([]);

  function handleAddHistory(entry) {
    setHistory(prev => [entry, ...prev].slice(0, 50));
  }

  const meta = PAGE_META[activePage] ?? PAGE_META.dashboard;

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <Header title={meta.title} subtitle={meta.subtitle} />

        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'predict'   && <PredictPage onAddHistory={handleAddHistory} />}
        {activePage === 'history'   && <HistoryPage extraHistory={history} />}
        {activePage === 'analytics' && <AnalyticsPage />}
      </main>
    </div>
  );
}
