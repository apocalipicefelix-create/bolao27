import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { participants as defaultParticipants, Participant } from '../data/participants';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trophy, 
  Search, 
  ChevronDown, 
  X,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  participantsOverride?: Participant[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ participantsOverride }) => {
  const currentParticipants = participantsOverride || defaultParticipants;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Dynamic zone sizes from localStorage
  const podiumSize = Number(localStorage.getItem('bolao_podium_size')) === 4 ? 4 : 3;
  const dangerSize = Number(localStorage.getItem('bolao_danger_size')) === 3 ? 3 : 4;

  // Sort participants by points descending, then AP descending
  const sortedParticipants = useMemo(() => {
    return [...currentParticipants].sort((a, b) => b.totalPoints - a.totalPoints || b.ap - a.ap);
  }, [currentParticipants]);

  // Reigning top scorer (Maior Pontuador)
  const topScorer = sortedParticipants[0] || currentParticipants[0];

  // Filter participants by search term
  const filteredParticipants = useMemo(() => {
    return sortedParticipants.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [sortedParticipants, searchTerm]);

  return (
    <div className="space-y-6 py-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-widest uppercase mb-2 border border-emerald-500/20">
            <Trophy size={14} /> BL27 • Classificação em Tempo Real
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">
            Tabela do <span className="text-emerald-500">Bolão</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 max-w-xl">
            Estilo oficial de planilha com os {currentParticipants.length} participantes ordenados por pontos (PTS) e desempate por acertos de placar (AP).
          </p>
        </div>
      </div>

      {/* Search and info bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Buscar participante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-bold"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-zinc-500 flex items-center gap-2">
          <SlidersHorizontal size={14} />
          <span>{currentParticipants.length} Participantes Ativos</span>
        </div>
      </div>

      {/* Spreadsheet Style Table Container */}
      <div className="overflow-hidden rounded-xl border-2 border-zinc-400 dark:border-zinc-700 bg-[#e8e8e8] dark:bg-zinc-900 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#2e7d32] text-white border-b-2 border-zinc-600 select-none">
                <th className="py-2 px-2 w-14 text-center font-black uppercase text-xs tracking-wider border-r border-[#1b5e20]">
                  POS
                </th>
                <th className="py-2 px-2 w-12 text-center font-black uppercase text-xs tracking-wider border-r border-[#1b5e20]">
                  -
                </th>
                <th className="py-2 px-3 font-black uppercase text-xs sm:text-sm tracking-wider border-r border-[#1b5e20] flex items-center justify-between">
                  <span>PARTICIPANTES</span>
                  <ChevronDown size={14} className="text-white/80" />
                </th>
                <th className="py-2 px-3 sm:px-4 w-24 text-center font-black uppercase text-xs sm:text-sm tracking-wider border-r border-[#1b5e20]">
                  <div className="flex items-center justify-center gap-1">
                    <span>PTS</span>
                    <ChevronDown size={14} className="text-white/80" />
                  </div>
                </th>
                <th className="py-2 px-3 sm:px-4 w-24 text-center font-black uppercase text-xs sm:text-sm tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <span>AP</span>
                    <ChevronDown size={14} className="text-white/80" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y border-zinc-400 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-100">
              {filteredParticipants.map((p) => {
                const pos = sortedParticipants.findIndex(item => item.id === p.id) + 1;
                const isPodium = pos <= podiumSize;
                const isDanger = currentParticipants.length >= dangerSize && pos > currentParticipants.length - dangerSize;
                
                const loggedUser = localStorage.getItem('bolao_active_participant');
                const isMe = loggedUser && p.name.toUpperCase() === loggedUser.toUpperCase();
                const prevPos = p.previousPosition || pos;
                const trend = prevPos > pos ? 'up' : prevPos < pos ? 'down' : 'same';

                return (
                  <tr 
                    key={p.id}
                    onClick={() => setSelectedParticipant(p)}
                    className={cn(
                      "transition-all cursor-pointer",
                      isMe 
                        ? "bg-emerald-500/15 dark:bg-emerald-500/25 ring-2 ring-emerald-400 font-bold relative z-10 shadow-lg" 
                        : "hover:bg-zinc-200/70 dark:hover:bg-zinc-800/50 bg-white dark:bg-zinc-900"
                    )}
                  >
                    {/* Position Column */}
                    <td className="p-0 border-r border-zinc-300 dark:border-zinc-800 text-center font-black font-mono text-xs sm:text-sm">
                      <div className={cn(
                        "w-full h-full py-1.5 px-2 flex items-center justify-center",
                        isPodium 
                          ? "bg-[#1976d2] text-white font-black" 
                          : isDanger 
                          ? "bg-[#d32f2f] text-white font-black" 
                          : "bg-[#e0e0e0] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                      )}>
                        {pos}º
                      </div>
                    </td>

                    {/* Variation Arrow / Square Column */}
                    <td className="py-1.5 px-1.5 border-r border-zinc-300 dark:border-zinc-800 text-center">
                      {trend === 'up' && (
                        <div className="w-6 h-6 mx-auto rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold" title="Subiu de posição">
                          <ArrowUp size={12} strokeWidth={3} />
                        </div>
                      )}
                      {trend === 'down' && (
                        <div className="w-6 h-6 mx-auto rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold" title="Caiu de posição">
                          <ArrowDown size={12} strokeWidth={3} />
                        </div>
                      )}
                      {trend === 'same' && (
                        <div className="w-6 h-6 mx-auto rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center" title="Manteve a posição">
                          <div className="w-2 h-2 rounded-sm bg-zinc-400 dark:bg-zinc-500" />
                        </div>
                      )}
                    </td>

                    {/* Participant Name */}
                    <td className="py-1.5 px-3 border-r border-zinc-300 dark:border-zinc-800 font-bold uppercase tracking-wide text-xs sm:text-sm text-zinc-900 dark:text-white">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(isMe && "text-emerald-600 dark:text-emerald-400 font-black")}>{p.name}</span>
                        <div className="flex items-center gap-1">
                          {isMe && (
                            <span className="text-[9px] bg-emerald-500 text-zinc-950 font-black px-1 py-0.5 rounded shadow-sm animate-pulse">
                              ⭐ VOCÊ
                            </span>
                          )}
                          {pos === 1 && p.totalPoints > 0 && (
                            <span className="text-[9px] bg-amber-400 text-zinc-950 font-black px-1 py-0.5 rounded shadow-sm">
                              👑 LÍDER
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* PTS */}
                    <td className="py-1.5 px-3 sm:px-4 border-r border-zinc-300 dark:border-zinc-800 text-center font-mono font-black text-base sm:text-lg text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900/50">
                      {p.totalPoints}
                    </td>

                    {/* AP */}
                    <td className="py-1.5 px-3 sm:px-4 text-center font-mono font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 bg-zinc-50 dark:bg-zinc-900/50">
                      {p.ap}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#2e7d32] text-white flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#1976d2] inline-block"></span>
              <strong>G{podiumSize}:</strong> Zona de Premiação
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#d32f2f] inline-block"></span>
              <strong>Z{dangerSize}:</strong> Zona de Alerta
            </span>
          </div>
          <div className="font-mono text-white/90 text-xs">
            Total: {currentParticipants.length} participantes
          </div>
        </div>
      </div>

      {/* Reigning Top Scorer Banner (Maior Pontuador) - Positioned Below Main Table */}
      {topScorer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-zinc-950 border-none shadow-2xl relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-15">
              <Crown size={160} />
            </div>
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-950 text-amber-400 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Crown size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-950/20 text-zinc-950">
                    Maior Pontuador do Bolão BL27
                  </span>
                  <h2 className="text-3xl font-black uppercase italic tracking-tight mt-1 text-zinc-950">
                    {topScorer.name}
                  </h2>
                  <p className="text-xs text-zinc-900 font-semibold">
                    Atualizado automaticamente • Liderança isolada na tabela
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-zinc-950/10 dark:bg-zinc-950/20 px-6 py-3 rounded-2xl border border-black/10">
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 block">Pontos</span>
                  <span className="text-3xl font-black font-mono text-zinc-950">{topScorer.totalPoints}</span>
                </div>
                <div className="w-px h-8 bg-black/20" />
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 block">Placares (AP)</span>
                  <span className="text-3xl font-black font-mono text-zinc-950">{topScorer.ap}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Modal: Participant Detail Sheet */}
      <AnimatePresence>
        {selectedParticipant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl">
                    {sortedParticipants.findIndex(p => p.id === selectedParticipant.id) + 1}º
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight">
                      {selectedParticipant.name}
                    </h3>
                    <p className="text-xs text-zinc-400">Participante do BL27</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Total de Pontos</span>
                  <span className="text-3xl font-black text-white">{selectedParticipant.totalPoints}</span>
                  <span className="text-xs text-zinc-400 block mt-1">Acumulados</span>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block">Acertos de Placar (AP)</span>
                  <span className="text-3xl font-black text-emerald-400">{selectedParticipant.ap}</span>
                  <span className="text-xs text-zinc-400 block mt-1">Critério de desempate</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedParticipant(null)}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
