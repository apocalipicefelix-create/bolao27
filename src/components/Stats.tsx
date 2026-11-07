import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { participants as defaultParticipants, Participant } from '../data/participants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, BarChart3, Target, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatsProps {
  onGoToLeaderboard?: () => void;
  participantsOverride?: Participant[];
}

export const Stats: React.FC<StatsProps> = ({ onGoToLeaderboard, participantsOverride }) => {
  const currentParticipants = participantsOverride || defaultParticipants;

  const sortedParticipants = useMemo(() => 
    [...currentParticipants].sort((a, b) => b.totalPoints - a.totalPoints || b.ap - a.ap), 
  [currentParticipants]);

  const bestScorer = sortedParticipants[0];
  const worstScorer = sortedParticipants[sortedParticipants.length - 1];

  const totalPointsAll = useMemo(() => 
    currentParticipants.reduce((acc, p) => acc + p.totalPoints, 0), 
  [currentParticipants]);

  const averagePoints = (totalPointsAll / currentParticipants.length).toFixed(1);

  const totalApAll = useMemo(() => 
    currentParticipants.reduce((acc, p) => acc + p.ap, 0), 
  [currentParticipants]);

  const chartData = useMemo(() => {
    const rounds = currentParticipants[0]?.history?.length || 1;
    return Array.from({ length: rounds }, (_, i) => {
      const roundData: any = { name: `R${i + 1}` };
      currentParticipants.forEach(p => {
        roundData[p.name] = p.history[i] ?? p.totalPoints;
      });
      return roundData;
    });
  }, [currentParticipants]);

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-zinc-950 shadow-xl overflow-hidden relative">
            <div className="absolute top-[-20px] right-[-20px] opacity-15">
              <Trophy size={160} />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-zinc-950 text-white font-bold border-none uppercase tracking-wider text-[10px]">
                  1º LUGAR • LÍDER ATUAL
                </Badge>
              </div>
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter">
                {bestScorer?.name || 'N/A'}
              </CardTitle>
              <CardDescription className="text-emerald-950 font-semibold">
                Liderando a tabela com {bestScorer?.ap || 0} acertos de placar (AP).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black font-mono">
                {bestScorer?.totalPoints || 0} <span className="text-xl font-sans">PTS</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-gradient-to-br from-rose-500 to-rose-700 border-none text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-[-20px] right-[-20px] opacity-15">
              <Target size={160} />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-zinc-950 text-white font-bold border-none uppercase tracking-wider text-[10px]">
                  LANTERNA • ZONA Z4
                </Badge>
              </div>
              <CardTitle className="text-4xl font-black uppercase italic tracking-tighter">
                {worstScorer?.name || 'N/A'}
              </CardTitle>
              <CardDescription className="text-rose-100 font-medium">
                Paga a taxa de R$ 1,50 para os brindes da rodada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black font-mono">
                {worstScorer?.totalPoints || 0} <span className="text-xl font-sans">PTS</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono">{averagePoints}</div>
            <p className="text-xs text-zinc-500 mt-1">Pontos médios por competidor</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total de Placares Exatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono text-emerald-500 flex items-center gap-1.5">
              <Target size={24} />
              {totalApAll} AP
            </div>
            <p className="text-xs text-zinc-500 mt-1">Placares na mosca de 3 pontos</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono">14</div>
            <p className="text-xs text-zinc-500 mt-1">Competidores ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Top 3 Premiação (G3)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-black text-blue-500 truncate">
              {sortedParticipants[0]?.name}, {sortedParticipants[1]?.name}, {sortedParticipants[2]?.name}
            </div>
            <p className="text-xs text-zinc-500 mt-1">G3 dividindo 100% da bolada</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 rounded-xl text-zinc-950">
              <BarChart3 size={20} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white uppercase italic">Evolução Rodada a Rodada</CardTitle>
              <CardDescription className="text-zinc-400">Trajetória dos principais pontuadores ao longo do campeonato</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #3f3f46',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '12px' }} />
              {currentParticipants.slice(0, 6).map((p, i) => (
                <Line 
                  key={p.id}
                  type="monotone" 
                  dataKey={p.name} 
                  stroke={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][i]} 
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 1.5 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
