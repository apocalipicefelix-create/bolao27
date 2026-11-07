import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AndroidInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar o aplicativo no seu Android: toque nos três pontinhos do navegador (Chrome) e selecione "Adicionar à tela inicial" ou "Instalar aplicativo".');
    }
  };

  if (installed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-4 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider shadow-md">
      <div className="flex items-center gap-2">
        <Smartphone size={16} className="animate-pulse" />
        <span>Instalar BL27 como Aplicativo Android no Celular</span>
      </div>
      <button
        onClick={handleInstallClick}
        className="px-3 py-1 bg-zinc-950 text-emerald-400 rounded-lg hover:bg-zinc-900 transition-all flex items-center gap-1 shadow"
      >
        <Download size={14} /> Instalar App
      </button>
    </div>
  );
};
