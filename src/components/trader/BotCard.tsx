import React from 'react';
import { Cpu, Sliders, Shield, TrendingUp, Check, Activity, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RiskBadge } from './RiskBadge';
import { BotStatusBadge } from './BotStatusBadge';
import { AIBot } from '../../types/trader';

interface BotCardProps {
  bot: AIBot;
  onConfigure: (bot: AIBot) => void;
  onToggleStatus?: (bot: AIBot) => void;
  onViewDetails?: (bot: AIBot) => void;
}

export const BotCard: React.FC<BotCardProps> = ({
  bot,
  onConfigure,
  onToggleStatus,
  onViewDetails,
}) => {
  return (
    <Card
      variant="default"
      padding="lg"
      hoverEffect={true}
      className="relative flex flex-col justify-between border-white/[0.08] hover:border-indigo-500/30 transition-all duration-200"
    >
      <div>
        {/* Top Header: Name, Strategy, Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display leading-tight">
                  {bot.name}
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  Strategy: {bot.strategy}
                </span>
              </div>
            </div>
          </div>
          <BotStatusBadge status={bot.status} />
        </div>

        {/* Tagline & Risk Profile */}
        <div className="flex items-center gap-2 mb-3">
          <RiskBadge level={bot.riskLevel} size="sm" />
          <span className="text-[11px] font-mono text-slate-400">
            Pair: <strong className="text-slate-200">{bot.tradingPair}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          {bot.description}
        </p>

        {/* Historical Performance Matrix (Clearly labeled simulation / historical) */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Historical Simulation Data
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Past 30D</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Sim. 30D P&L</span>
              <span className="text-emerald-400 font-bold block mt-0.5">
                {bot.historicalPerformance.monthlyPnl}
              </span>
            </div>
            <div className="border-x border-white/[0.06] px-2">
              <span className="text-[10px] text-slate-400 block font-sans">Win Rate</span>
              <span className="text-white font-bold block mt-0.5">
                {bot.historicalPerformance.winRate}%
              </span>
            </div>
            <div className="pl-1">
              <span className="text-[10px] text-slate-400 block font-sans">Max Drawdown</span>
              <span className="text-amber-400 font-bold block mt-0.5">
                {bot.historicalPerformance.maxDrawdown}
              </span>
            </div>
          </div>
        </div>

        {/* Key algorithmic features */}
        <div className="space-y-1.5 mb-5">
          {bot.features.slice(0, 3).map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
              <Check className="h-3 w-3 text-indigo-400 shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <div className="text-[11px] font-mono text-slate-500">
          Min: <span className="text-slate-300 font-semibold">${bot.minInvestment}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <Button variant="ghost" size="xs" onClick={() => onViewDetails(bot)}>
              Details
            </Button>
          )}
          <Button
            variant="primary"
            size="xs"
            icon={Sliders}
            onClick={() => onConfigure(bot)}
          >
            {bot.status === 'Active' ? 'Edit Bot' : 'Configure & Run'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
