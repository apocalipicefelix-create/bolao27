import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Calendar, ArrowRight, Target } from 'lucide-react';
import { Participant } from '../data/participants';
import { ParticipantPortal } from './ParticipantPortal';

interface IntroductionProps {
  onNavigate?: (tab: 'home' | 'leaderboard' | 'stats' | 'admin') => void;
  participants: Participant[];
}

export const Introduction: React.FC<IntroductionProps> = ({ onNavigate, participants }) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-widest uppercase border border-emerald-500/20 shadow-sm">
          <Trophy size={14} /> Bolão Oficial 2027 • {participants.length} Participantes
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">
          Brasileirão <span className="text-emerald-500">2027</span>
        </h1>
        <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed">
          O maior espetáculo do futebol brasileiro. Crie sua senha, envie seus palpites e acompanhe a tabela em tempo real!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate?.('leaderboard')}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
          >
            <Trophy size={18} />
            Ver Tabela Atualizada
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => onNavigate?.('stats')}
            className="px-7 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-wider border border-zinc-200 dark:border-zinc-800 transition-all"
          >
            Ver Estatísticas & Gráficos
          </button>
        </div>
      </motion.section>

      {/* Participant Portal Section */}
      <section className="pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight">
            Área do Participante • Senha & Palpites
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Faça login com seu nome e senha para enviar seus palpites da rodada.
          </p>
        </div>
        <ParticipantPortal participants={participants} onNavigateTab={(tab) => onNavigate?.(tab)} />
      </section>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 bg-zinc-900 text-white rounded-3xl space-y-4 border border-zinc-800 shadow-2xl relative overflow-hidden"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="text-zinc-900" size={24} />
          </div>
          <h3 className="text-2xl font-bold uppercase italic">A Glória do G3</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            O 1º colocado leva <strong>50%</strong> da bolada, o 2º leva <strong>30%</strong> e o 3º garante <strong>20%</strong>. Cada ponto faz a diferença na reta final.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 bg-zinc-100 dark:bg-zinc-900/70 rounded-3xl space-y-4 border border-zinc-200 dark:border-zinc-800 shadow-xl"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Target className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold uppercase italic text-zinc-900 dark:text-white">Critério AP</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            Empatou na pontuação? O desempate oficial é pelos <strong>Acertos no Placar (AP)</strong>. Acertar na mosca vale prestígio e vantagem na tabela.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-8 bg-emerald-500 text-zinc-900 rounded-3xl space-y-4 shadow-2xl shadow-emerald-500/20"
        >
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold uppercase italic">Craques na Luta</h3>
          <p className="text-zinc-900 font-medium text-sm leading-relaxed">
            Disputas quentes em todas as posições para pontuar rodada a rodada e fugir do temido Z4!
          </p>
        </motion.div>
      </div>

      {/* Hero Banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative h-[380px] rounded-[36px] overflow-hidden group shadow-2xl border border-zinc-200 dark:border-zinc-800"
      >
        <img 
          src="https://picsum.photos/seed/stadium/1920/1080" 
          alt="Estádio Lotado" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-3">
            <Calendar size={16} />
            <span>Temporada 2027 • 38 Rodadas de Pura Adrenalina</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic leading-tight max-w-2xl">
            Sinta a vibração de cada estádio e torça pelo seu palpite!
          </h2>
        </div>
      </motion.section>
    </div>
  );
};
