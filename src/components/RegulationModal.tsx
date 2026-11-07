import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, AlertTriangle, Trophy, DollarSign, MessageCircle } from 'lucide-react';

interface RegulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationModal: React.FC<RegulationModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-emerald-500">
            Regulamento do Bolão
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-medium">
            Leia atentamente as regras para a temporada 2026.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="p-6 h-[60vh]">
          <div className="space-y-8 pb-8">
            {/* Mudanças */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                <Info size={16} />
                <span>Dinâmica e Mudanças</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-sm leading-relaxed text-zinc-300">
                Em cada rodada teremos 10 jogos. O palpite deve ser enviado até a hora exata do primeiro jogo da rodada. 
                <span className="block mt-2 text-rose-400 font-bold italic">
                  * Se o jogo já tiver começado, não poderá mais palpitar sobre ele, apenas nos restantes.
                </span>
                Usaremos um grupo no **Telegram** para os palpites, programados para revelação simultânea.
              </div>
            </section>

            {/* Pontuação */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                <Trophy size={16} />
                <span>Sistema de Pontuação</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                  <h4 className="font-bold text-white mb-1 uppercase text-xs">Vitória/Empate Exato</h4>
                  <p className="text-2xl font-black text-emerald-500">3 PTS</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase">Acerto do placar cheio</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                  <h4 className="font-bold text-white mb-1 uppercase text-xs">Acerto de Tendência</h4>
                  <p className="text-2xl font-black text-zinc-400">1 PT</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase">Acerto do vencedor ou empate (placar diferente)</p>
                </div>
              </div>
            </section>

            {/* Financeiro */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                <DollarSign size={16} />
                <span>Investimento e Prêmios</span>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-sm">
                  <p className="font-bold text-white mb-2">Valor da Participação:</p>
                  <p className="text-zinc-300">R$ 70,00 por participante. Pagamento até o fim do primeiro turno.</p>
                  <div className="mt-2 flex items-center gap-2 text-rose-400 font-bold italic text-xs">
                    <AlertTriangle size={14} />
                    <span>Punição de 10 pontos em caso de atraso.</span>
                  </div>
                </div>
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-sm">
                  <p className="font-bold text-emerald-500 mb-2 uppercase tracking-widest text-xs">Premiação:</p>
                  <ul className="space-y-1 text-zinc-300 font-medium">
                    <li>• 1º Colocado: 50%</li>
                    <li>• 2º Colocado: 30%</li>
                    <li>• 3º Colocado: 20%</li>
                  </ul>
                  <p className="mt-2 text-[10px] text-zinc-500 uppercase">Se houver novos inscritos, abriremos premiação para o 4º (G4).</p>
                </div>
              </div>
            </section>

            {/* Desempate e Menor Pontuador */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Critério de Desempate</h4>
                <p className="text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                  Maior número de acertos no placar exato (**AP**).
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Menor Pontuador</h4>
                <p className="text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                  Paga **R$ 1,50** por rodada para o fundo de brindes final.
                </p>
              </div>
            </section>

            {/* Brindes Finais */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                <Trophy size={16} />
                <span>Brindes de Encerramento</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-sm text-zinc-300">
                O maior pontuador fora do G3/G4 garante um brinde. 
                <span className="block mt-2 text-zinc-500 text-xs italic">
                  * Participantes do G3/G4 e do Z3/Z4 não participam do sorteio de brindes.
                </span>
              </div>
            </section>

            {/* Contato */}
            <div className="pt-4 flex items-center justify-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <MessageCircle size={14} />
              <span>Dúvidas? Chame no privado.</span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
