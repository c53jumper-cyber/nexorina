import React, { useState } from 'react';
import { LineChart, TrendingUp, Sparkles, Layers } from 'lucide-react';
import { BOT_PERFORMANCE_CHART_DATA } from '../../data/mockTraderData';

interface TradingChartProps {
  title?: string;
  metricType?: 'value' | 'pnl' | 'drawdown';
}

export const TradingChart: React.FC<TradingChartProps> = ({
  title = 'Bot Portfolio Value & Simulation Curve',
}) => {
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D' | '90D' | 'All'>('7D');
  const [activeMetric, setActiveMetric] = useState<'value' | 'pnl' | 'drawdown'>('value');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const rawData = BOT_PERFORMANCE_CHART_DATA[timeframe] || BOT_PERFORMANCE_CHART_DATA['7D'];
  const values = rawData.map((d) => (activeMetric === 'value' ? d.value : activeMetric === 'pnl' ? d.pnl : d.drawdown));
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  const currentVal = values[values.length - 1];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl">
      {/* Header with Title, Metric Switcher, and Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              {title}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-emerald-400">
              {activeMetric === 'drawdown' ? 'Drawdown %' : '+12.28% Growth'}
            </span>
          </div>

          <div className="text-2xl font-bold font-mono text-white">
            {activeMetric === 'value' && `$${currentVal.toLocaleString()}`}
            {activeMetric === 'pnl' && `+$${currentVal.toFixed(2)}`}
            {activeMetric === 'drawdown' && `${currentVal.toFixed(1)}%`}
          </div>
        </div>

        {/* Metric Selector & Timeframe */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric tabs */}
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 text-xs">
            {(['value', 'pnl', 'drawdown'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] capitalize transition-colors ${
                  activeMetric === m
                    ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'value' ? 'Balance' : m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Timeframe buttons */}
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 text-xs">
            {(['24H', '7D', '30D', '90D', 'All'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                  timeframe === tf
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative h-56 w-full">
        <svg
          viewBox="0 0 500 200"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="traderChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="traderLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[40, 90, 140, 190].map((y, idx) => (
            <line
              key={idx}
              x1="0"
              y1={y}
              x2="500"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {(() => {
            const step = 500 / (rawData.length - 1);
            const range = maxVal - minVal || 1;
            const coords = rawData.map((d, i) => {
              const val = activeMetric === 'value' ? d.value : activeMetric === 'pnl' ? d.pnl : d.drawdown;
              const x = i * step;
              const y = 180 - ((val - minVal) / range) * 140;
              return { x, y, item: d, val };
            });

            const linePath = coords.reduce((acc, curr, idx, arr) => {
              if (idx === 0) return `M ${curr.x} ${curr.y}`;
              const prev = arr[idx - 1];
              const cx1 = prev.x + (curr.x - prev.x) / 2;
              const cy1 = prev.y;
              const cx2 = prev.x + (curr.x - prev.x) / 2;
              const cy2 = curr.y;
              return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
            }, '');

            const areaPath = `${linePath} L 500 195 L 0 195 Z`;

            return (
              <>
                <path d={areaPath} fill="url(#traderChartGrad)" />
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#traderLineGrad)"
                  strokeWidth="2.5"
                />

                {coords.map((c, i) => (
                  <g key={i} className="cursor-pointer">
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={hoverIndex === i ? 6 : 4}
                      fill={hoverIndex === i ? '#06B6D4' : '#6366F1'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      onMouseEnter={() => setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex(null)}
                    />
                  </g>
                ))}
              </>
            );
          })()}
        </svg>

        {/* Hover Tooltip */}
        {hoverIndex !== null && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-xl border border-indigo-500/40 bg-[#070A14]/90 px-3 py-1.5 text-xs text-white backdrop-blur shadow-lg font-mono pointer-events-none">
            <span>{rawData[hoverIndex].time}: </span>
            <span className="font-bold text-cyan-300">
              {activeMetric === 'value' && `$${rawData[hoverIndex].value}`}
              {activeMetric === 'pnl' && `+$${rawData[hoverIndex].pnl.toFixed(2)}`}
              {activeMetric === 'drawdown' && `${rawData[hoverIndex].drawdown}%`}
            </span>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
        {rawData.map((d, i) => (
          <span key={i}>{d.time}</span>
        ))}
      </div>
    </div>
  );
};
