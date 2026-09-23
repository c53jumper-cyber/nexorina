import React, { useState } from 'react';
import { Sliders, X, ShieldAlert, Zap, DollarSign, Clock, HelpCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { AIBot, BotConfiguration } from '../../types/trader';

interface BotConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: AIBot | null;
  onSaveAndDeploy: (botId: string, config: BotConfiguration) => void;
}

export const BotConfigModal: React.FC<BotConfigModalProps> = ({
  isOpen,
  onClose,
  bot,
  onSaveAndDeploy,
}) => {
  if (!isOpen || !bot) return null;

  const [tradingPair, setTradingPair] = useState<string>(
    bot.activeConfig?.tradingPair || bot.tradingPair
  );
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    bot.activeConfig?.investmentAmount || 1000
  );
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>(
    bot.activeConfig?.riskLevel || bot.riskLevel
  );
  const [maxDrawdownPercent, setMaxDrawdownPercent] = useState<number>(
    bot.activeConfig?.maxDrawdownPercent || 8
  );
  const [dailyTradingLimit, setDailyTradingLimit] = useState<number>(
    bot.activeConfig?.dailyTradingLimit || 400
  );
  const [takeProfitCondition, setTakeProfitCondition] = useState<number>(
    bot.activeConfig?.takeProfitConditionPercent || 12
  );
  const [stopLossCondition, setStopLossCondition] = useState<number>(
    bot.activeConfig?.stopLossConditionPercent || 5
  );
  const [durationDays, setDurationDays] = useState<number>(
    bot.activeConfig?.durationDays || 30
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAndDeploy(bot.id, {
      tradingPair,
      investmentAmount,
      riskLevel,
      maxDrawdownPercent,
      dailyTradingLimit,
      takeProfitConditionPercent: takeProfitCondition,
      stopLossConditionPercent: stopLossCondition,
      durationDays,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#0C101D] p-6 shadow-2xl shadow-indigo-500/10 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Configure {bot.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Strategy: {bot.strategy} · Default Risk: {bot.riskLevel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* 1. Trading Pair */}
          <div>
            <label className="text-slate-300 font-semibold mb-1.5 block">
              Target Trading Pair
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {bot.supportedPairs.map((pair) => (
                <button
                  type="button"
                  key={pair}
                  onClick={() => setTradingPair(pair)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs border text-center transition-all ${
                    tradingPair === pair
                      ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                      : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pair}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Investment Amount & Daily Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>Investment Capital ($)</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Min: ${bot.minInvestment}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                  $
                </span>
                <input
                  type="number"
                  min={bot.minInvestment}
                  max={50000}
                  step={50}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-7 pr-3 py-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>Daily Trading Limit ($)</span>
                <span className="text-[10px] text-slate-500 font-mono">Max per 24h</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                  $
                </span>
                <input
                  type="number"
                  min={100}
                  max={10000}
                  step={50}
                  value={dailyTradingLimit}
                  onChange={(e) => setDailyTradingLimit(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-7 pr-3 py-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Risk Level Override */}
          <div>
            <label className="text-slate-300 font-semibold mb-1.5 block">
              Risk Tolerance Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setRiskLevel(lvl)}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs capitalize transition-all ${
                    riskLevel === lvl
                      ? 'border-indigo-500/80 bg-indigo-500/20 text-white font-bold'
                      : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl} Risk
                </button>
              ))}
            </div>
          </div>

          {/* 4. Maximum Drawdown & Stop Bot Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06]">
            <div>
              <label className="text-slate-300 block mb-1 text-[11px]">
                Max Drawdown Limit
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={maxDrawdownPercent}
                  onChange={(e) => setMaxDrawdownPercent(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-2 py-1.5 text-rose-400 font-mono text-xs text-center"
                />
                <span className="text-slate-400 font-mono">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Circuit breaker</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 text-[11px]">
                Take Profit Target
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={3}
                  max={50}
                  value={takeProfitCondition}
                  onChange={(e) => setTakeProfitCondition(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-2 py-1.5 text-emerald-400 font-mono text-xs text-center"
                />
                <span className="text-slate-400 font-mono">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Locks total profit</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 text-[11px]">
                Hard Stop Loss
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={2}
                  max={25}
                  value={stopLossCondition}
                  onChange={(e) => setStopLossCondition(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-2 py-1.5 text-amber-400 font-mono text-xs text-center"
                />
                <span className="text-slate-400 font-mono">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Emergency stop</span>
            </div>
          </div>

          {/* 5. Duration */}
          <div>
            <label className="text-slate-300 font-semibold mb-1.5 block">
              Execution Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 14, 30, 90].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setDurationDays(days)}
                  className={`py-2 rounded-xl border text-center font-mono text-xs transition-all ${
                    durationDays === days
                      ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                      : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer Banner */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-indigo-400 font-semibold">Simulation Mode: </span>
            This configuration will be saved in your active bot registry. In this stage, execution
            data reflects simulated model performance with no capital transferred.
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Launch Bot
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
