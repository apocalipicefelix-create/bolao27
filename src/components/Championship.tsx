import React from 'react';
import { motion } from 'motion/react';
import { teams, nextMatches } from '../data/championship';
import { participants } from '../data/participants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Calendar, Users, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Championship: React.FC = () => {
  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Central do <span className="text-emerald-500">Brasileirão</span></h2>
          <p className="text-zinc-500 font-medium">Acompanhe o campeonato e o impacto nos palpites.</p>
        </div>
        <Badge variant="outline" className="w-fit border-emerald-500/50 text-emerald-500 uppercase tracking-widest font-bold">
          Rodada 11 em andamento
        </Badge>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl h-14">
          <TabsTrigger value="table" className="rounded-xl font-bold uppercase tracking-widest text-xs gap-2">
            <Trophy size={16} /> Tabela
          </TabsTrigger>
          <TabsTrigger value="matches" className="rounded-xl font-bold uppercase tracking-widest text-xs gap-2">
            <Calendar size={16} /> Próximos Jogos
          </TabsTrigger>
          <TabsTrigger value="impact" className="rounded-xl font-bold uppercase tracking-widest text-xs gap-2">
            <Users size={16} /> Impacto Bolão
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                <TableRow>
                  <TableHead className="w-[60px] font-bold uppercase text-[10px] tracking-widest">Pos</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest">Clube</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">P</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest hidden sm:table-cell">J</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest hidden sm:table-cell">V</TableHead>
                  <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest hidden sm:table-cell">SG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <TableCell className="font-mono font-bold text-zinc-400">
                      {index + 1 <= 4 ? (
                        <span className="text-emerald-500">{(index + 1).toString().padStart(2, '0')}</span>
                      ) : (
                        (index + 1).toString().padStart(2, '0')
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                        <span className="font-bold uppercase italic text-sm">{team.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-black">{team.points}</TableCell>
                    <TableCell className="text-right text-zinc-500 hidden sm:table-cell">{team.played}</TableCell>
                    <TableCell className="text-right text-zinc-500 hidden sm:table-cell">{team.won}</TableCell>
                    <TableCell className="text-right text-zinc-500 hidden sm:table-cell">{team.goalsFor - team.goalsAgainst}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextMatches.map((match) => (
              <Card key={match.id} className="border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/30 transition-all group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{match.stadium}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">{match.date} • {match.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center p-2">
                        <img src={teams.find(t => t.name === match.homeTeam)?.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-black uppercase italic text-xs text-center">{match.homeTeam}</span>
                    </div>
                    <div className="text-zinc-300 font-black text-2xl italic">VS</div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center p-2">
                        <img src={teams.find(t => t.name === match.awayTeam)?.logo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-black uppercase italic text-xs text-center">{match.awayTeam}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase italic">Reflexo na Classificação</CardTitle>
                <CardDescription>Como os resultados atuais estão moldando o bolão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {participants.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-zinc-900 font-black text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold uppercase italic text-sm">{p.name}</h4>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Apostou na vitória do Palmeiras</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-500 font-black text-lg">+3 PTS</div>
                        <div className="text-[10px] text-zinc-400 uppercase font-bold">Resultado Exato</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-emerald-500 text-zinc-900 border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase italic">Destaque da Rodada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm mb-4">
                    <strong>LC BAIXINHO</strong> disparou na frente após acertar o clássico carioca!
                  </p>
                  <div className="p-3 bg-zinc-900/10 rounded-xl border border-zinc-900/10">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                      <Info size={14} />
                      <span>Fator de Impacto</span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-80">Vitórias de visitantes estão rendendo bônus de +2 pontos nesta rodada.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 text-white border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase italic">Próximos Palpites</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Participantes que já votaram</span>
                    <span className="font-bold text-emerald-500">12/14</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      className="bg-emerald-500 h-full"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-center">Prazo encerra em 04:22:15</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
