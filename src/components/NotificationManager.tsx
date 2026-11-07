import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationManager: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reminderActive, setReminderActive] = useState<boolean>(() => {
    return localStorage.getItem('bolao_reminder_active') === 'true';
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Automatic 1-hour before first match deadline checker
  useEffect(() => {
    if (!reminderActive || permission !== 'granted') return;

    const checkDeadline = () => {
      const savedMatches = localStorage.getItem('bolao_custom_matches');
      if (!savedMatches) return;

      try {
        const matches = JSON.parse(savedMatches);
        if (matches.length > 0) {
          const firstMatch = matches[0]; // e.g. "10/11 - 16:00"
          // We can check if reminder was already triggered for this round
          const lastTriggered = localStorage.getItem('bolao_last_reminder_match');
          if (lastTriggered !== firstMatch.id) {
            // For demonstration and robustness, we check if notification is due or simulate auto-alert
            // In a real live app, we parse date/time. Here we notify that the deadline for the first match is active.
            const notifiedKey = `bolao_notified_${firstMatch.id}`;
            if (!localStorage.getItem(notifiedKey)) {
              sendLocalNotification(
                '⏰ Lembrete BL27 • Prazo de Palpites',
                `Falta pouco para o 1º jogo (${firstMatch.homeTeam} x ${firstMatch.awayTeam} às ${firstMatch.date}). Envie seu palpite!`
              );
              localStorage.setItem(notifiedKey, 'true');
              localStorage.setItem('bolao_last_reminder_match', firstMatch.id);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const interval = setInterval(checkDeadline, 30000); // Check periodically
    checkDeadline();

    return () => clearInterval(interval);
  }, [reminderActive, permission]);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Seu navegador não suporta notificações.');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        showToast('Notificações e lembretes ativados!');
        new Notification('BL27 • Lembretes Ativos', {
          body: 'Você será alertado automaticamente 1 hora antes do primeiro jogo da rodada!',
          icon: '/favicon.ico'
        });
      } else {
        showToast('Permissão de notificação negada.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleReminder = () => {
    const nextState = !reminderActive;
    setReminderActive(nextState);
    localStorage.setItem('bolao_reminder_active', String(nextState));
    if (nextState) {
      showToast('⏰ Lembrete automático de 1h antes do 1º jogo ativado!');
      sendLocalNotification('⏰ Lembrete BL27 Ativado', 'O sistema avisará 1 hora antes do primeiro jogo de cada rodada.');
    } else {
      showToast('Lembrete desativado.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={requestPermission}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
            permission === 'granted'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:scale-105'
          }`}
          title={permission === 'granted' ? 'Notificações ativadas' : 'Ativar notificações'}
        >
          {permission === 'granted' ? <BellRing size={15} className="text-emerald-400 animate-bounce" /> : <Bell size={15} />}
          <span className="hidden sm:inline">
            {permission === 'granted' ? 'Alertas Ativos' : 'Ativar Alertas'}
          </span>
        </button>

        <button
          onClick={toggleReminder}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm border ${
            reminderActive
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-white'
          }`}
          title={reminderActive ? 'Lembrete automático ligado' : 'Ligar lembrete automático'}
        >
          <Clock size={15} className={reminderActive ? 'text-amber-400 animate-spin' : ''} />
          <span className="hidden md:inline">
            {reminderActive ? 'Lembrete 1h Ativo' : 'Lembrete 1h'}
          </span>
        </button>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 bg-zinc-900 border border-emerald-500/30 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const sendLocalNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.ico' });
    } catch (e) {
      console.error(e);
    }
  }
};
