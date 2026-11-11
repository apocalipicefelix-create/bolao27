import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../data/participants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KeyRound, User, Send, CheckCircle2, Trophy, ArrowRight, LogOut, Lock, Unlock, Eye, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParticipantPortalProps {
  participants: Participant[];
  onNavigateTab: (tab: 'leaderboard' | 'stats') => void;
}

export const ParticipantPortal: React.FC<ParticipantPortalProps> = ({ participants, onNavigateTab }) => {
  const [selectedName, setSelectedName] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loggedParticipant, setLoggedParticipant] = useState<string | null>(() => {
    return localStorage.getItem('bolao_active_participant');
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [predictions, setPredictions] = useState<Record<string, { home: string; away: string }>>({});

  // Dynamic matches loaded from localStorage (admin managed)
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

  // Passwords storage
  const [passwordsMap, setPasswordsMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('bolao_participant_passwords');
    return saved ? JSON.parse(saved) : {};
  });

  // Predictions storage
  const [allPredictions, setAllPredictions] = useState<Record<string, Record<string, { home: string; away: string }>>>(() => {
    const saved = localStorage.getItem('bolao_all_predictions');
    return saved ? JSON.parse(saved) : {};
  });

  // Predictions release status
  const [predictionsReleased, setPredictionsReleased] = useState<boolean>(() => {
    return localStorage.getItem('bolao_predictions_released') === 'true';
  });

  // Special overrides for late submissions
  const [specialOverrides, setSpecialOverrides] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('bolao_special_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  const isUserOverridden = loggedParticipant ? !!specialOverrides[loggedParticipant] : false;
  const canSubmitPredictions = !predictionsReleased || isUserOverridden;

  useEffect(() => {
    const interval = setInterval(() => {
      const released = localStorage.getItem('bolao_predictions_released') === 'true';
      setPredictionsReleased(released);
      const savedMatches = localStorage.getItem('bolao_custom_matches');
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
      const savedAllPreds = localStorage.getItem('bolao_all_predictions');
      if (savedAllPreds) {
        setAllPredictions(JSON.parse(savedAllPreds));
      }
      const savedOverrides = localStorage.getItem('bolao_special_overrides');
      if (savedOverrides) {
        setSpecialOverrides(JSON.parse(savedOverrides));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('bolao_participant_passwords', JSON.stringify(passwordsMap));
  }, [passwordsMap]);

  useEffect(() => {
    localStorage.setItem('bolao_all_predictions', JSON.stringify(allPredictions));
  }, [allPredictions]);

  useEffect(() => {
    if (loggedParticipant && allPredictions[loggedParticipant]) {
      setPredictions(allPredictions[loggedParticipant]);
    } else {
      setPredictions({});
    }
  }, [loggedParticipant]);

  const handleSelectParticipant = (name: string) => {
    setSelectedName(name);
    setPasswordInput('');
    setErrorMsg('');
    if (passwordsMap[name]) {
      setIsRegistering(false);
    } else {
      setIsRegistering(true);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName) return;

    if (isRegistering) {
      if (!passwordInput || passwordInput.length < 3) {
        setErrorMsg('A senha precisa ter pelo menos 3 dígitos.');
        return;
      }
      const updatedMap = { ...passwordsMap, [selectedName]: passwordInput };
      setPasswordsMap(updatedMap);
      localStorage.setItem('bolao_active_participant', selectedName);
      setLoggedParticipant(selectedName);
      setSuccessMsg(`Senha criada e login realizado com sucesso, ${selectedName}!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      if (passwordsMap[selectedName] === passwordInput) {
        localStorage.setItem('bolao_active_participant', selectedName);
        setLoggedParticipant(selectedName);
        setErrorMsg('');
        setSuccessMsg(`Bem-vindo de volta, ${selectedName}!`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Senha incorreta. Tente novamente.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bolao_active_participant');
    setLoggedParticipant(null);
    setSelectedName('');
    setPasswordInput('');
  };

  const handleScoreChange = (matchId: string, type: 'home' | 'away', val: string) => {
    if (!canSubmitPredictions) return;
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        home: type === 'home' ? val : (prev[matchId]?.home || ''),
        away: type === 'away' ? val : (prev[matchId]?.away || '')
      }
    }));
  };

  const handleSavePredictions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedParticipant || !canSubmitPredictions) return;

    const updatedAll = {
      ...allPredictions,
      [loggedParticipant]: predictions
    };
    setAllPredictions(updatedAll);
    setSuccessMsg('Palpites salvos com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const currentParticipantObj = participants.find(p => p.name.toUpperCase() === loggedParticipant?.toUpperCase());
  const currentAvatar = currentParticipantObj?.avatar || '⚽';

  const handleSelectAvatar = (emoji: string) => {
    const updated = participants.map(p => 
      p.name.toUpperCase() === loggedParticipant?.toUpperCase() ? { ...p, avatar: emoji } : p
    );
    localStorage.setItem('bolao_participants_2027', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setSuccessMsg(`Emoji ${emoji} definido com sucesso!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {!loggedParticipant ? (
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-2xl overflow-hidden">
          <CardHeader className="text-center space-y-3 pb-6">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <KeyRound size={28} />
            </div>
            <CardTitle className="text-3xl font-black uppercase italic tracking-tight">
              Portal do Participante
            </CardTitle>
            <CardDescription className="text-zinc-400 max-w-md mx-auto">
              Selecione seu nome na lista oficial, crie sua senha ou entre para enviar seus palpites e ver os demais participantes quando liberado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                1. Escolha seu nome na lista:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-2 bg-zinc-950 rounded-2xl border border-zinc-800">
                {participants.map(p => {
                  const hasPassword = !!passwordsMap[p.name];
                  const isSelected = selectedName === p.name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectParticipant(p.name)}
                      className={cn(
                        "p-3 rounded-xl text-xs font-black uppercase tracking-wider text-left transition-all flex items-center justify-between border",
                        isSelected
                          ? "bg-emerald-500 text-zinc-950 border-emerald-400 shadow-lg"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                      )}
                    >
                      <span className="truncate">{p.name}</span>
                      {hasPassword ? <Lock size={12} className="shrink-0 opacity-70" /> : <Unlock size={12} className="shrink-0 opacity-50" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedName && (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAuth}
                className="space-y-4 pt-4 border-t border-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={16} /> Participante Selecionado: {selectedName}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    {isRegistering ? '⚠️ Crie sua senha de acesso' : '🔒 Digite sua senha'}
                  </span>
                </div>

                <div>
                  <input
                    type="password"
                    maxLength={10}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={isRegistering ? "Crie uma senha (mín. 3 dígitos)" : "Digite sua senha"}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="text-xs font-bold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <KeyRound size={18} />
                  {isRegistering ? 'Cadastrar Senha & Entrar' : 'Entrar no Portal'}
                </button>
              </motion.form>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Logged In Participant Dashboard */
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] opacity-10">
              <Trophy size={140} />
            </div>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold tracking-widest uppercase mb-2 border border-emerald-500/25">
                  <CheckCircle2 size={14} /> Sessão Ativa
                </div>
                <CardTitle className="text-3xl font-black uppercase italic tracking-tight">
                  Olá, {loggedParticipant}!
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Envie seus palpites e consulte os palpites dos demais participantes (quando liberados pelo admin).
                </CardDescription>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigateTab('leaderboard')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Trophy size={16} /> Ver Tabela Atualizada <ArrowRight size={14} />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  title="Sair da conta"
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {successMsg && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  {successMsg}
                </div>
              )}

              {/* Match Predictions Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2">
                    <Send size={18} className="text-emerald-400" />
                    Enviar Seus Palpites ({matches.length} Jogos na Rodada)
                  </h3>
                  {!canSubmitPredictions && (
                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={14} /> Palpites Encerrados
                    </span>
                  )}
                  {isUserOverridden && predictionsReleased && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      ⭐ Exceção Admin Concedida
                    </span>
                  )}
                </div>

                {!canSubmitPredictions ? (
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-rose-400 flex items-center justify-center mx-auto">
                      <Lock size={20} />
                    </div>
                    <p className="text-sm font-bold text-zinc-200">
                      O período de envio de palpites foi encerrado pelo administrador.
                    </p>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Você não pode mais enviar ou alterar palpites, pois a rodada já foi liberada para visualização geral. Caso precise de uma exceção, solicite ao administrador.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSavePredictions} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {matches.map(match => (
                        <div key={match.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span className="font-mono text-emerald-400">{match.date}</span>
                            <span>{match.stadium}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 text-right font-bold uppercase text-sm truncate">{match.homeTeam}</div>
                            <div className="flex items-center gap-2 shrink-0">
                              <input
                                type="number"
                                min={0}
                                max={99}
                                value={predictions[match.id]?.home || ''}
                                onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                className="w-12 h-12 text-center font-mono font-black text-lg bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="-"
                              />
                              <span className="text-zinc-500 font-bold">X</span>
                              <input
                                type="number"
                                min={0}
                                max={99}
                                value={predictions[match.id]?.away || ''}
                                onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                className="w-12 h-12 text-center font-mono font-black text-lg bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="-"
                              />
                            </div>
                            <div className="flex-1 font-bold uppercase text-sm truncate">{match.awayTeam}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                      >
                        <Send size={16} /> Salvar Meus Palpites
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Other Participants Predictions Section (Locked / Unlocked by Admin) */}
              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2">
                    <Users size={18} className="text-blue-400" />
                    Palpites dos Demais Participantes
                  </h3>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1",
                    predictionsReleased ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-400"
                  )}>
                    {predictionsReleased ? <Eye size={14} /> : <Lock size={14} />}
                    {predictionsReleased ? 'Liberado pelo Admin' : 'Oculto pelo Admin'}
                  </span>
                </div>

                {predictionsReleased ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      💡 Todos os palpites cadastrados pelos participantes estão visíveis abaixo:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(allPredictions).map(([partName, userPreds]) => {
                        if (partName === loggedParticipant) return null;
                        return (
                          <div key={partName} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                            <div className="font-black uppercase italic text-emerald-400 text-sm border-b border-zinc-800 pb-2">
                              {partName}
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {matches.map(m => {
                                const p = userPreds[m.id];
                                return (
                                  <div key={m.id} className="flex justify-between items-center text-xs text-zinc-400">
                                    <span className="truncate max-w-[180px]">{m.homeTeam} x {m.awayTeam}</span>
                                    <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-1 rounded">
                                      {p ? `${p.home} x ${p.away}` : 'Sem palpite'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-zinc-400 flex items-center justify-center mx-auto">
                      <Lock size={20} />
                    </div>
                    <p className="text-sm font-bold text-zinc-300">
                      Os palpites dos demais participantes estão ocultos no momento.
                    </p>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Assim que o administrador liberar a visualização no painel restrito, todos os participantes logados poderão ver os palpites de cada um.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
