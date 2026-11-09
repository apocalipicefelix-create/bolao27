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
import { LayoutDashboard, BarChart2, Trophy, FileText, TableProperties, Lock, Sun, Moon, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'leaderboard' | 'stats' | 'admin'>('leaderboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegulationOpen, setIsRegulationOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('bolao_theme');
    if (saved) {
      return saved === 'dark';
    }
    return true; // default dark theme
  });

  const [participantsList, setParticipantsList] = useState<Participant[]>(() => {
    const saved2027 = localStorage.getItem('bolao_participants_2027');
    if (saved2027) {
      try {
        return JSON.parse(saved2027);
      } catch (e) {
        // fallback
      }
    }
    const saved2026 = localStorage.getItem('bolao_participants_2026');
    if (saved2026) {
      try {
        return JSON.parse(saved2026);
      } catch (e) {
        return defaultParticipants;
      }
    }
    return defaultParticipants;
  });

  useEffect(() => {
    localStorage.setItem('bolao_participants_2027', JSON.stringify(participantsList));
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

      {/* Navigation Rail - Single Menu Bar with Dropdown */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 mt-0 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="relative flex items-center justify-between gap-3 bg-zinc-100 dark:bg-zinc-900 p-2 sm:p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
            {/* Logo / Brand */}
            <div 
              onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}
              className="flex items-center gap-2 cursor-pointer group shrink-0 pl-1"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="text-zinc-900" size={16} />
              </div>
              <span className="font-black uppercase italic tracking-tighter text-lg sm:text-xl">
                BL<span className="text-emerald-500">27</span>
              </span>
            </div>

            {/* Right Controls: Theme, Notification & Hamburger Menu Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:scale-105 transition-all shadow-sm"
                title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
              >
                {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
              </button>

              <NotificationManager />

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all"
                title="Abrir menu de opções"
              >
                {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
                <span>Menu</span>
              </button>
            </div>

            {/* Dropdown Menu Popup */}
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1.5"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-1">
                  Navegação do Bolão
                </div>
                <button
                  onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    activeTab === 'home' 
                      ? "bg-emerald-500 text-zinc-950 font-black shadow-sm" 
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <LayoutDashboard size={15} />
                  <span>Início</span>
                </button>

                <button
                  onClick={() => { setActiveTab('leaderboard'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    activeTab === 'leaderboard' 
                      ? "bg-emerald-500 text-zinc-950 font-black shadow-sm" 
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <TableProperties size={15} />
                  <span>Tabela de Pontos</span>
                </button>

                <button
                  onClick={() => { setActiveTab('stats'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    activeTab === 'stats' 
                      ? "bg-emerald-500 text-zinc-950 font-black shadow-sm" 
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <BarChart2 size={15} />
                  <span>Estatísticas & Gráficos</span>
                </button>

                <button
                  onClick={() => { setActiveTab('admin'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                    activeTab === 'admin' 
                      ? "bg-emerald-500 text-zinc-950 font-black shadow-sm" 
                      : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <Lock size={15} />
                  <span>Painel Admin</span>
                </button>

                <div className="border-t border-zinc-200 dark:border-zinc-800 my-1 pt-1">
                  <button
                    onClick={() => { setIsRegulationOpen(true); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                  >
                    <FileText size={15} />
                    <span>Regulamento</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-24 sm:pt-28 pb-20">
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
            <span>© 2027 BL27 • Aplicativo Web & PWA Android</span>
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
