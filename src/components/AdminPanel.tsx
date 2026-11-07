import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Participant, participants as defaultParticipants } from '../data/participants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Unlock, Save, RotateCcw, ShieldCheck, Check, AlertCircle, UserPlus, Trash2, Users, BellRing, Eye, EyeOff, Plus, Calendar, Zap, Layers, CheckSquare, Square } from 'lucide-react';
import { sendLocalNotification } from './NotificationManager';
import { cn } from '@/lib/utils';

interface AdminPanelProps {
  participantsData: Participant[];
  onUpdateParticipants: (updated: Participant[]) => void;
}

const ADMIN_PIN = '7498';

export const AdminPanel: React.FC<AdminPanelProps> = ({ participantsData, onUpdateParticipants }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bolao_admin_authenticated') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editableList, setEditableList] = useState<Participant[]>(participantsData);
  const [newParticipantName, setNewParticipantName] = useState('');

  useEffect(() => {
    setEditableList(participantsData);
  }, [participantsData]);

  // Zone configuration state (G3 vs G4, Z3 vs Z4)
  const [podiumSize, setPodiumSize] = useState<3 | 4>(() => {
    return Number(localStorage.getItem('bolao_podium_size')) === 4 ? 4 : 3;
  });
  const [dangerSize, setDangerSize] = useState<3 | 4>(() => {
    return Number(localStorage.getItem('bolao_danger_size')) === 3 ? 3 : 4;
  });

  // Predictions release state
  const [predictionsReleased, setPredictionsReleased] = useState<boolean>(() => {
    return localStorage.getItem('bolao_predictions_released') === 'true';
  });

  // Special overrides for late submissions (Name -> boolean)
  const [specialOverrides, setSpecialOverrides] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bolao_special_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  // Custom matches state
  const [matches, setMatches] = useState<Array<{ id: string; homeTeam: string; awayTeam: string; date: string; stadium: string }>>(() => {
    const saved = localStorage.getItem('bolao_custom_matches');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', homeTeam: 'Palmeiras', awayTeam: 'Flamengo', date: '10/11 - 16:00', stadium: 'Allianz Parque' },
      { id: 'm2', homeTeam: 'Corinthians', awayTeam: 'São Paulo', date: '10/11 - 18:30', stadium: 'Neo Química Arena' },
      { id: 'm3', homeTeam: 'Fluminense', awayTeam: 'Botafogo', date: '11/11 - 20:00', stadium: 'Maracanã' },
      { id: 'm4', homeTeam: 'Grêmio', awayTeam: 'Internacional', date: '11/11 - 21:30', stadium: 'Arena do Grêmio' },
      { id: 'm5', homeTeam: 'Atlético-MG', awayTeam: 'Cruzeiro', date: '12/11 - 16:00', stadium: 'Arena MRV' },
      { id: 'm6', homeTeam: 'Bahia', awayTeam: 'Vitória', date: '12/11 - 18:30', stadium: 'Fonte Nova' },
      { id: 'm7', homeTeam: 'Athletico-PR', awayTeam: 'Coritiba', date: '13/11 - 19:30', stadium: 'Ligga Arena' },
      { id: 'm8', homeTeam: 'Fortaleza', awayTeam: 'Ceará', date: '13/11 - 21:30', stadium: 'Castelão' },
      { id: 'm9', homeTeam: 'Vasco', awayTeam: 'Botafogo', date: '14/11 - 20:00', stadium: 'São Januário' },
      { id: 'm10', homeTeam: 'Santos', awayTeam: 'São Paulo', date: '14/11 - 21:30', stadium: 'Vila Belmiro' }
    ];
  });

  const [newHome, setNewHome] = useState('');
  const [newAway, setNewAway] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStadium, setNewStadium] = useState('');

  // Match results input state
  const [matchResults, setMatchResults] = useState<Record<string, { home: string; away: string }>>(() => {
    const saved = localStorage.getItem('bolao_match_results');
    return saved ? JSON.parse(saved) : {};
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bolao_admin_authenticated', 'true');
      setErrorMsg('');
      setEditableList(participantsData);
    } else {
      setErrorMsg('PIN incorreto. Tente novamente.');
      setPinInput('');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bolao_admin_authenticated');
    setPinInput('');
  };

  const handleTogglePodium = (size: 3 | 4) => {
    setPodiumSize(size);
    localStorage.setItem('bolao_podium_size', String(size));
    setSuccessMsg(`Zona de premiação alterada para G${size}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleDanger = (size: 3 | 4) => {
    setDangerSize(size);
    localStorage.setItem('bolao_danger_size', String(size));
    setSuccessMsg(`Zona de risco alterada para Z${size}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleOverride = (name: string) => {
    const nextOverrides = {
      ...specialOverrides,
      [name]: !specialOverrides[name]
    };
    setSpecialOverrides(nextOverrides);
    localStorage.setItem('bolao_special_overrides', JSON.stringify(nextOverrides));
    setSuccessMsg(`Exceção atualizada para ${name}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFieldChange = (id: string, field: 'totalPoints' | 'ap', value: string) => {
    const num = parseInt(value, 10);
    const val = isNaN(num) ? 0 : Math.max(0, num);
    setEditableList(prev => 
      prev.map(p => p.id === id ? { ...p, [field]: val } : p)
    );
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newParticipantName.trim().toUpperCase();
    if (!trimmedName) return;

    if (editableList.some(p => p.name === trimmedName)) {
      setErrorMsg('Já existe um participante com este nome.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: trimmedName,
      position: editableList.length + 1,
      previousPosition: editableList.length + 1,
      totalPoints: 0,
      ap: 0,
      variation: 'same',
      history: [0]
    };

    const updated = [...editableList, newParticipant];
    setEditableList(updated);
    onUpdateParticipants(updated);
    setNewParticipantName('');
    setSuccessMsg(`Participante ${trimmedName} adicionado com sucesso!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteParticipant = (id: string, name: string) => {
    const updated = editableList.filter(p => p.id !== id);
    setEditableList(updated);
    onUpdateParticipants(updated);
    setSuccessMsg(`Participante ${name} removido com sucesso!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddCustomMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHome.trim() || !newAway.trim()) return;

    const match = {
      id: 'match_' + Date.now(),
      homeTeam: newHome.trim(),
      awayTeam: newAway.trim(),
      date: newDate.trim() || 'A definir',
      stadium: newStadium.trim() || 'Estádio Principal'
    };

    const updated = [...matches, match];
    setMatches(updated);
    localStorage.setItem('bolao_custom_matches', JSON.stringify(updated));
    setNewHome('');
    setNewAway('');
    setNewDate('');
    setNewStadium('');
    setSuccessMsg('Partida adicional incluída na rodada com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteMatch = (id: string) => {
    const updated = matches.filter(m => m.id !== id);
    setMatches(updated);
    localStorage.setItem('bolao_custom_matches', JSON.stringify(updated));
    setSuccessMsg('Partida removida da rodada.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleResultChange = (matchId: string, type: 'home' | 'away', val: string) => {
    setMatchResults(prev => ({
      ...prev,
      [matchId]: {
        home: type === 'home' ? val : (prev[matchId]?.home || ''),
        away: type === 'away' ? val : (prev[matchId]?.away || '')
      }
    }));
  };

  const calculateStandingsForMatches = (targetMatchIds?: string[]) => {
    localStorage.setItem('bolao_match_results', JSON.stringify(matchResults));

    const allPredictions: Record<string, Record<string, { home: string; away: string }>> = JSON.parse(
      localStorage.getItem('bolao_all_predictions') || '{}'
    );

    const matchesToProcess = targetMatchIds 
      ? matches.filter(m => targetMatchIds.includes(m.id))
      : matches;

    const updatedParticipants = editableList.map(participant => {
      let earnedPoints = participant.totalPoints;
      let earnedAp = participant.ap;
      const userPreds = allPredictions[participant.name] || {};

      matchesToProcess.forEach(match => {
        const res = matchResults[match.id];
        const pred = userPreds[match.id];

        if (res && res.home !== '' && res.away !== '' && pred && pred.home !== '' && pred.away !== '') {
          const actualHome = parseInt(res.home, 10);
          const actualAway = parseInt(res.away, 10);
          const predHome = parseInt(pred.home, 10);
          const predAway = parseInt(pred.away, 10);

          if (!isNaN(actualHome) && !isNaN(actualAway) && !isNaN(predHome) && !isNaN(predAway)) {
            if (predHome === actualHome && predAway === actualAway) {
              earnedPoints += 3;
              earnedAp += 1;
            } else {
              const actualDiff = actualHome - actualAway;
              const predDiff = predHome - predAway;
              const actualOutcome = actualDiff > 0 ? 'home' : actualDiff < 0 ? 'away' : 'draw';
              const predOutcome = predDiff > 0 ? 'home' : predDiff < 0 ? 'away' : 'draw';

              if (actualOutcome === predOutcome) {
                earnedPoints += 1;
              }
            }
          }
        }
      });

      return {
        ...participant,
        previousPosition: participant.position,
        totalPoints: earnedPoints,
        ap: earnedAp
      };
    });

    const sorted = [...updatedParticipants].sort((a, b) => b.totalPoints - a.totalPoints || b.ap - a.ap);
    const ranked = sorted.map((p, index) => {
      const newPos = index + 1;
      const varState = p.previousPosition > newPos ? 'up' as const : p.previousPosition < newPos ? 'down' as const : 'same' as const;
      return {
        ...p,
        position: newPos,
        variation: varState
      };
    });

    setEditableList(ranked);
    onUpdateParticipants(ranked);

    sendLocalNotification(
      '⚡ Tabela BL27 Atualizada!', 
      'O administrador lançou os resultados dos jogos. Confira a nova classificação.'
    );

    setSuccessMsg(targetMatchIds ? 'Resultado calculado e tabela atualizada!' : 'Todos os resultados calculados!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleToggleReleasePredictions = () => {
    const nextState = !predictionsReleased;
    setPredictionsReleased(nextState);
    localStorage.setItem('bolao_predictions_released', String(nextState));

    if (nextState) {
      sendLocalNotification('🔓 Palpites Liberados!', 'O administrador liberou a visualização dos palpites de todos os participantes.');
      setSuccessMsg('Palpites liberados para visualização de todos os participantes!');
    } else {
      setSuccessMsg('Palpites ocultados novamente.');
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSave = () => {
    const sorted = [...editableList].sort((a, b) => b.totalPoints - a.totalPoints || b.ap - a.ap);
    const ranked = sorted.map((p, index) => ({
      ...p,
      position: index + 1,
      variation: p.position > (index + 1) ? 'up' as const : p.position < (index + 1) ? 'down' as const : 'same' as const
    }));

    onUpdateParticipants(ranked);
    setEditableList(ranked);
    
    sendLocalNotification(
      '🏆 BL27 Atualizado', 
      'A tabela de pontuação foi atualizada pelo administrador!'
    );

    setSuccessMsg('Alterações salvas com sucesso!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleNotifyNewRound = () => {
    sendLocalNotification(
      '⚽ Nova Rodada BL27 Aberta!', 
      'O período de palpites para a próxima rodada já está aberto. Envie o seu!'
    );
    setSuccessMsg('Alerta de nova rodada disparado!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetAll = () => {
    if (window.confirm('Tem certeza que deseja restaurar a lista padrão de participantes com pontos zerados?')) {
      const reset = defaultParticipants.map(p => ({ ...p, totalPoints: 0, ap: 0, position: 1, variation: 'same' as const }));
      onUpdateParticipants(reset);
      setEditableList(reset);
      setSuccessMsg('Lista restaurada e pontos zerados!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <Lock size={28} />
            </div>
            <CardTitle className="text-2xl font-black uppercase italic">Área Restrita do Admin</CardTitle>
            <CardDescription className="text-zinc-400">
              Digite o PIN de acesso exclusivo para gerenciar o BL27.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Desbloquear Painel
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-widest uppercase mb-2 border border-emerald-500/20">
            <ShieldCheck size={14} /> Modo Administrador Ativo (Sessão Persistida)
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">
            Painel <span className="text-emerald-500">BL27</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Configuração de zonas (G3/G4, Z3/Z4), exceções de palpites e resultados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleReleasePredictions}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border shadow-sm",
              predictionsReleased
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30"
            )}
            title="Liberar ou ocultar palpites para todos"
          >
            {predictionsReleased ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{predictionsReleased ? 'Palpites Liberados (Ocultar)' : 'Liberar Palpites p/ Todos'}</span>
          </button>

          <button
            onClick={handleNotifyNewRound}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <BellRing size={16} />
            <span>Notificar Rodada</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
          >
            <Save size={16} />
            <span>Salvar Tabela</span>
          </button>

          <button
            onClick={handleLogoutAdmin}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-all"
            title="Bloquear painel admin"
          >
            <Unlock size={14} /> Bloquear
          </button>
        </div>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20"
        >
          <Check size={18} />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-bold text-rose-400 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20"
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Special Exceptions Card (Allow Late Submissions) */}
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2">
            <Users size={18} className="text-amber-400" />
            Exceções de Envio (Atrasados / Fora do Horário)
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Mesmo após a liberação geral dos palpites, selecione abaixo os participantes que ganham permissão especial para registrar/editar seu palpite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {editableList.map(p => {
              const hasOverride = !!specialOverrides[p.name];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleToggleOverride(p.name)}
                  className={cn(
                    "p-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all flex items-center justify-between border",
                    hasOverride
                      ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-lg font-black"
                      : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                  )}
                >
                  <span className="truncate">{p.name}</span>
                  {hasOverride ? <CheckSquare size={16} className="shrink-0" /> : <Square size={16} className="shrink-0 opacity-50" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Zone Configuration (G3/G4 & Z3/Z4) */}
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" />
            Configuração de Zonas (Premiação e Risco)
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Alterne entre G3 / G4 para premiação e Z3 / Z4 para a zona de alerta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Zona de Premiação (Pódio)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleTogglePodium(3)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  podiumSize === 3 ? "bg-blue-600 text-white shadow-md" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                )}
              >
                G3 (Top 3)
              </button>
              <button
                onClick={() => handleTogglePodium(4)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  podiumSize === 4 ? "bg-blue-600 text-white shadow-md" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                )}
              >
                G4 (Top 4)
              </button>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Zona de Alerta (Brindes)</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleDanger(3)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  dangerSize === 3 ? "bg-rose-600 text-white shadow-md" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                )}
              >
                Z3 (Bottom 3)
              </button>
              <button
                onClick={() => handleToggleDanger(4)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  dangerSize === 4 ? "bg-rose-600 text-white shadow-md" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                )}
              >
                Z4 (Bottom 4)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Results & Per-Match Calculation Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-800">
          <div>
            <CardTitle className="text-xl font-bold uppercase italic flex items-center gap-2">
              <Zap size={20} className="text-amber-400 animate-pulse" />
              Resultados das Partidas & Cálculo Individual
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Insira o placar real de cada jogo e clique em "Calcular Partida" para atualizar a tabela instantaneamente.
            </CardDescription>
          </div>
          <button
            onClick={() => calculateStandingsForMatches()}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Zap size={15} /> Calcular Todos os Jogos
          </button>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-1">
            {matches.map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-emerald-400">{m.date}</span>
                  <span>{m.stadium}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 text-right font-bold uppercase text-sm truncate">{m.homeTeam}</div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={matchResults[m.id]?.home || ''}
                      onChange={(e) => handleResultChange(m.id, 'home', e.target.value)}
                      className="w-12 h-12 text-center font-mono font-black text-lg bg-zinc-900 border border-emerald-500/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="-"
                    />
                    <span className="text-zinc-500 font-bold">X</span>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={matchResults[m.id]?.away || ''}
                      onChange={(e) => handleResultChange(m.id, 'away', e.target.value)}
                      className="w-12 h-12 text-center font-mono font-black text-lg bg-zinc-900 border border-emerald-500/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="-"
                    />
                  </div>
                  <div className="flex-1 font-bold uppercase text-sm truncate">{m.awayTeam}</div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => calculateStandingsForMatches([m.id])}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-[11px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Zap size={12} /> Calcular Partida
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Match Management Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" />
            Gerenciar Partidas da Rodada ({matches.length} jogos)
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Adicione partidas extras ou remova jogos da rodada atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddCustomMatch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <input
              type="text"
              value={newHome}
              onChange={(e) => setNewHome(e.target.value)}
              placeholder="Mandante"
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-bold uppercase placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={newAway}
              onChange={(e) => setNewAway(e.target.value)}
              placeholder="Visitante"
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-bold uppercase placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="Data (ex: 15/11 - 16:00)"
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-medium placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={newStadium}
              onChange={(e) => setNewStadium(e.target.value)}
              placeholder="Estádio / Local"
              className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-medium placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Plus size={16} /> Adicionar Jogo
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {matches.map((m, idx) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <span className="font-mono text-emerald-400">{idx + 1}.</span>
                <span className="font-bold uppercase">{m.homeTeam} x {m.awayTeam}</span>
                <span className="text-zinc-400">{m.date} ({m.stadium})</span>
                <button
                  onClick={() => handleDeleteMatch(m.id)}
                  className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition-all"
                  title="Remover partida"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Participant Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2">
            <UserPlus size={18} className="text-emerald-400" />
            Adicionar Novo Participante
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Digite o nome do novo participante para incluí-lo no BL27.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddParticipant} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder="Nome do participante (ex: CARLOS)"
              className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold uppercase"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              Adicionar Participante
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Participants Management Table */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <CardTitle className="text-xl font-bold uppercase italic flex items-center gap-2">
              <Users size={18} className="text-emerald-500" />
              Lista de Participantes ({editableList.length})
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Edite pontos, placares ou remova participantes da lista.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4 w-16 text-center">#</th>
                  <th className="py-4 px-4">Participante</th>
                  <th className="py-4 px-6 text-center w-36">Pontos (PTS)</th>
                  <th className="py-4 px-6 text-center w-36">Placares (AP)</th>
                  <th className="py-4 px-4 text-center w-24">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-sans">
                {editableList.map((p, index) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-4 text-center font-mono font-bold text-zinc-400">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="py-4 px-4 font-black uppercase italic text-zinc-900 dark:text-white">
                      {p.name}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="number"
                        min={0}
                        value={p.totalPoints}
                        onChange={(e) => handleFieldChange(p.id, 'totalPoints', e.target.value)}
                        className="w-24 text-center font-mono font-black text-lg py-1 px-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="number"
                        min={0}
                        value={p.ap}
                        onChange={(e) => handleFieldChange(p.id, 'ap', e.target.value)}
                        className="w-24 text-center font-mono font-bold text-lg py-1 px-2 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-xl text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDeleteParticipant(p.id, p.name)}
                        className="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition-all"
                        title="Excluir participante"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
