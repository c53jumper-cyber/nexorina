import React, { useState } from 'react';
import {
  Dices,
  Flame,
  Play,
  RotateCw,
  Sparkles,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CasinoGame } from '../types';
import { Modal } from '../components/common/Modal';

interface CasinoPageProps {
  games: CasinoGame[];
}

export const CasinoPage: React.FC<CasinoPageProps> = ({ games }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDemoGame, setActiveDemoGame] = useState<CasinoGame | null>(null);

  // Demo simulator state for interactive play preview
  const [demoScore, setDemoScore] = useState<number>(1000);
  const [demoBet, setDemoBet] = useState<number>(10);
  const [demoSpinResult, setDemoSpinResult] = useState<string[]>(['💎', '7️⃣', '💎']);
  const [demoMultiplier, setDemoMultiplier] = useState<number>(1.0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const categories = ['All', 'Slots', 'Crash', 'Dice', 'Roulette', 'Blackjack', 'Live Games'];

  const filteredGames =
    selectedCategory === 'All'
      ? games
      : games.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenDemo = (game: CasinoGame) => {
    setActiveDemoGame(game);
    setDemoNotice(null);
    setDemoMultiplier(1.0);
  };

  const handleSimulateRound = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setDemoNotice(null);

    if (activeDemoGame?.category === 'Slots') {
      const symbols = ['💎', '7️⃣', '⚡', '🍒', '🔔', '🪙'];
      let ticks = 0;
      const interval = setInterval(() => {
        setDemoSpinResult([
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ]);
        ticks++;
        if (ticks >= 8) {
          clearInterval(interval);
          setIsSimulating(false);
          const isWin = Math.random() > 0.4;
          if (isWin) {
            const winAmt = demoBet * 3;
            setDemoScore((prev) => prev + winAmt);
            setDemoNotice(`🎉 Demo Win! +${winAmt} Demo Credits`);
          } else {
            setDemoScore((prev) => Math.max(0, prev - demoBet));
            setDemoNotice(`Round complete. -${demoBet} Demo Credits`);
          }
        }
      }, 100);
    } else {
      // Crash or Dice simulated round
      let mult = 1.0;
      const interval = setInterval(() => {
        mult += 0.2;
        setDemoMultiplier(parseFloat(mult.toFixed(2)));
        if (mult >= 2.6 || Math.random() > 0.85) {
          clearInterval(interval);
          setIsSimulating(false);
          setDemoScore((prev) => prev + Math.round(demoBet * mult));
          setDemoNotice(`🚀 Cashed out at ${mult.toFixed(2)}x (+${Math.round(demoBet * mult)} Credits)`);
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#140D26] via-[#0E1020] to-[#0A0D17] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <Dices className="h-3.5 w-3.5" />
              <span>PROVABLY FAIR ENTERTAINMENT · DEMO PRACTICE SANDBOX</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-display">
              Casino Lobby & Games
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Explore high-fidelity Web3 mini-games. Experience RNG mechanics, verifiable odds, and
              instant feedback in risk-free demo mode.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-xs text-purple-300">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            <span>Verifiable RNG · 0% Real Financial Risk (Demo Mode)</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/30'
                : 'bg-[#0A0D17] text-slate-400 border border-white/[0.06] hover:text-white hover:border-white/[0.12]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0E1A] hover:border-purple-500/40 hover:bg-[#0D1222] transition-all flex flex-col justify-between"
          >
            {/* Game Visual / Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-purple-900/20 via-slate-900 to-[#0A0E1A]">
              {game.image ? (
                <img
                  src={game.image}
                  alt={game.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center flex-col gap-2">
                  <Dices className="h-10 w-10 text-purple-400/40" />
                  <span className="text-[11px] font-mono text-slate-500">{game.name}</span>
                </div>
              )}

              {/* Status and category badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/60 backdrop-blur-md text-white border border-white/[0.1]">
                  {game.category}
                </span>
                {game.status === 'Hot' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-500/80 backdrop-blur-md text-white flex items-center gap-0.5">
                    <Flame className="h-3 w-3" /> HOT
                  </span>
                )}
                {game.status === 'New' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/80 backdrop-blur-md text-white">
                    NEW
                  </span>
                )}
              </div>

              {/* Live players count */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-md text-slate-300">
                <Users className="h-3 w-3 text-slate-400" />
                <span>{game.playersCount.toLocaleString()} online</span>
              </div>
            </div>

            {/* Game Info & Action */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {game.name}
                </h3>
                <div className="mt-0.5 text-[11px] text-slate-400 font-mono">RTP: {game.rtp}</div>
              </div>

              <button
                onClick={() => handleOpenDemo(game)}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Play Demo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Modal Simulator */}
      {activeDemoGame && (
        <Modal
          isOpen={!!activeDemoGame}
          onClose={() => setActiveDemoGame(null)}
          title={`Demo Play: ${activeDemoGame.name}`}
          subtitle="Verifiable interactive sandbox preview (No real currency involved)"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs">
              <span className="text-slate-400">Virtual Demo Balance</span>
              <span className="font-mono text-purple-300 font-bold text-sm">
                {demoScore.toLocaleString()} Credits
              </span>
            </div>

            {/* Simulated Game Board */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#07090F] p-6 text-center">
              {activeDemoGame.category === 'Slots' ? (
                <div className="space-y-4">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Interactive Reel Matrix
                  </div>
                  <div className="flex justify-center items-center gap-4 py-4 text-4xl">
                    {demoSpinResult.map((res, i) => (
                      <div
                        key={i}
                        className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/[0.03] border border-purple-500/30 shadow-inner"
                      >
                        {res}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="text-xs font-mono text-slate-400">Current Multiplier</div>
                  <div className="text-4xl font-bold font-mono text-purple-400 tabular-nums">
                    {demoMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Ascending trajectory simulation
                  </div>
                </div>
              )}

              {demoNotice && (
                <div className="mt-4 p-2 rounded-lg bg-white/[0.04] text-xs font-medium text-emerald-300">
                  {demoNotice}
                </div>
              )}
            </div>

            {/* Bet controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Demo Stake:</span>
                <div className="flex items-center gap-1">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDemoBet(amt)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                        demoBet === amt
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSimulateRound}
                disabled={isSimulating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-semibold text-white transition-all shadow-md shadow-purple-600/30"
              >
                <RotateCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
                {isSimulating ? 'Testing...' : 'Execute Round'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
