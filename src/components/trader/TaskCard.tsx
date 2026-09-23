import React from 'react';
import { Clock, Play, Gift, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { RiskBadge } from './RiskBadge';
import { EnhancedTraderTask } from '../../data/mockTraderData';

interface TaskCardProps {
  task: EnhancedTraderTask;
  onAction: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onAction }) => {
  const isReady = task.status === 'Ready to Claim';
  const isCompleted = task.status === 'Completed';
  const isInProgress = task.status === 'In Progress';

  return (
    <Card
      variant="default"
      padding="lg"
      hoverEffect={true}
      className={`relative border-white/[0.08] transition-all duration-200 ${
        isReady ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : ''
      }`}
    >
      {/* Top row: Asset Badge, Task Title, Status */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/20 font-mono text-xs font-bold text-indigo-300">
            {task.asset}
          </span>
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              {task.taskName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{task.duration}</span>
              </span>
              <span>·</span>
              <span>{task.timeRemaining}</span>
            </div>
          </div>
        </div>

        <RiskBadge level={task.riskLevel} size="sm" />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-3">
        {task.description}
      </p>

      {/* Reward & Progress Box */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-sans">Expected Reward</span>
          <span className="text-emerald-400 font-bold">{task.expectedReward}</span>
        </div>

        <ProgressBar
          value={task.progress}
          label="Execution Progress"
          showPercent={true}
          size="sm"
          color={isReady ? 'emerald' : 'indigo'}
        />
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span
            className={`h-2 w-2 rounded-full ${
              isReady
                ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                : isInProgress
                ? 'bg-indigo-400 animate-pulse'
                : isCompleted
                ? 'bg-slate-500'
                : 'bg-cyan-400'
            }`}
          />
          <span className="text-slate-300">{task.status}</span>
        </div>

        <div>
          {isReady && (
            <Button
              variant="primary"
              size="xs"
              icon={Gift}
              onClick={() => onAction(task.id)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              Claim Bounty
            </Button>
          )}

          {isInProgress && (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onAction(task.id)}
              className="border-indigo-500/30 text-indigo-300"
            >
              Speed Up Task
            </Button>
          )}

          {task.status === 'Available' && (
            <Button
              variant="primary"
              size="xs"
              icon={Play}
              onClick={() => onAction(task.id)}
            >
              Start Task
            </Button>
          )}

          {isCompleted && (
            <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Settled</span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
