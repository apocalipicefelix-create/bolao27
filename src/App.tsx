/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Introduction } from './components/Introduction';
import { Leaderboard } from './components/Leaderboard';
import { Stats } from './components/Stats';
import { AdminPanel } from './components/AdminPanel';
import { RegulationModal } from './components/RegulationModal';
import { NotificationManager } from './components/NotificationManager';
import { AndroidInstallBanner } from './components/AndroidInstallBanner';
import { participants as defaultParticipants, Participant } from './data/participants';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, BarChart2, Trophy, FileText, TableProperties, Lock, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'leaderboard' | 'stats' | 'admin'>('leaderboard');
  const [isRegulationOpen, setIsRegulationOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('bolao_theme');
    if (saved) {
      return saved === 'dark';
    }
    return true; // default dark theme
  });

  const [participantsList, setParticipantsList] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('bolao_participants_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultParticipants;
      }
    }
    return defaultParticipants;
  });

  useEffect(() => {
    localStorage.setItem('bolao_participants_2026', JSON.stringify(participantsList));
  }, [participantsList]);

  useEffect(() => {
    localStorage.setItem('bolao_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {/* Android PWA Install Banner */}
      <AndroidInstallBanner />

      {/* Regulation Modal */}
      <RegulationModal 
        isOpen={isRegulationOpen} 
        onClose={() => setIsRegulationOpen(false)} 
      />

      {/* Navigation Rail */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo / Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="text-zinc-900" size={20} />
            </div>
            <span className="font-black uppercase italic tracking-tighter text-2xl hidden sm:block">
              BL<span className="text-emerald-500">27</span>
            </span>
          </div>

          {/* Menus Separados */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
            <button
              onClick={() => setActiveTab('home')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'home' 
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-black" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <LayoutDashboard size={15} />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 relative",
                activeTab === 'leaderboard' 
                  ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-black" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <TableProperties size={15} />
              <span>Tabela</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'stats' 
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-black" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <BarChart2 size={15} />
              <span>Estatísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'admin' 
                  ? "bg-zinc-900 text-emerald-400 dark:bg-white dark:text-zinc-950 shadow-sm font-black" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Lock size={15} />
              <span>Admin</span>
            </button>
          </div>

          {/* Action Tools & Notifications & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:scale-105 transition-all shadow-sm"
              title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>

            <NotificationManager />

            <button 
              onClick={() => setIsRegulationOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-sm"
            >
              <FileText size={14} />
              <span className="hidden md:inline">Regulamento</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {activeTab === 'home' && <Introduction participants={participantsList} onNavigate={(tab) => setActiveTab(tab as any)} />}
            {activeTab === 'leaderboard' && <Leaderboard participantsOverride={participantsList} />}
            {activeTab === 'stats' && <Stats onGoToLeaderboard={() => setActiveTab('leaderboard')} participantsOverride={participantsList} />}
            {activeTab === 'admin' && <AdminPanel participantsData={participantsList} onUpdateParticipants={setParticipantsList} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              <Trophy size={12} className="text-emerald-500" />
            </div>
            <span>© 2026 BL27 • Aplicativo Web & PWA Android</span>
          </div>
          <div className="flex items-center gap-6 uppercase tracking-wider text-[11px] font-bold">
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className="hover:text-emerald-500 transition-colors"
            >
              Tabela de Pontos
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className="hover:text-emerald-500 transition-colors text-emerald-500 flex items-center gap-1"
            >
              <Lock size={12} /> Acesso Admin
            </button>
            <button 
              onClick={() => setIsRegulationOpen(true)}
              className="hover:text-emerald-500 transition-colors"
            >
              Regulamento
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
