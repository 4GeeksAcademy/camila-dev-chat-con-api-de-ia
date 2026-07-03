'use client';

import { formatTokens, formatResponseTime, calculateTokensPerSecond } from '@/lib/helpers';
import type { SessionMetrics } from '@/lib/metrics';

interface MetricsPanelProps {
  metrics: SessionMetrics | null;
  variant?: 'sidebar' | 'topbar';
  onClear?: () => void;
}

export default function MetricsPanel({ metrics, variant = 'sidebar', onClear }: MetricsPanelProps) {
  if (!metrics) return null;

  const avgTime = metrics.response_times?.length
    ? metrics.response_times.reduce((a: number, b: number) => a + b, 0) / metrics.response_times.length
    : 0;

  const tps = calculateTokensPerSecond(
    metrics.completion_tokens || 0,
    metrics.last_response_time || 0
  );

  if (variant === 'topbar') {
    return (
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-white/10 overflow-x-auto">
        <div className="flex items-center gap-3 px-3 h-12 min-w-max">
          {/* Clear button */}
          {onClear && (
            <>
              <button
                onClick={onClear}
                className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
              >
                Limpiar
              </button>
              <div className="w-px h-5 bg-white/10 shrink-0" />
            </>
          )}

          {/* Modelo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
              <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant shrink-0">
              Modelo
            </span>
            <span className="text-xs font-semibold text-primary truncate max-w-[80px]">
              {metrics.model || 'No conectado'}
            </span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Prompt tokens */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-on-surface-variant">Prompt</span>
            <span className="text-xs font-bold text-primary font-mono">{formatTokens(metrics.prompt_tokens)}</span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Completion tokens */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-on-surface-variant">Comp.</span>
            <span className="text-xs font-bold text-tertiary font-mono">{formatTokens(metrics.completion_tokens)}</span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Total tokens */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-on-surface-variant">Total</span>
            <span className="text-xs font-bold text-primary font-mono">{formatTokens(metrics.total_tokens)}</span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Response time */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-on-surface-variant">Tiempo</span>
            <span className="text-xs font-bold text-on-surface font-mono">{formatResponseTime(metrics.last_response_time)}</span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Avg time */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-on-surface-variant">Prom.</span>
            <span className="text-xs font-bold text-on-surface font-mono">{formatResponseTime(Math.round(avgTime))}</span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Tokens/s */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-on-surface-variant">T/s</span>
            <span className="text-xs font-bold text-tertiary font-mono">
              {tps > 0 ? `${tps}/s` : '—'}
            </span>
          </div>

          <div className="w-px h-5 bg-white/10 shrink-0" />

          {/* Live indicator */}
          <div className="flex items-center gap-1 shrink-0 pr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            <span className="text-[10px] text-on-surface-variant/60 whitespace-nowrap">En vivo</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 bg-surface-container border-l border-white/10 p-5 gap-5 overflow-y-auto">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-on-surface tracking-tight">Métricas de sesión</h3>
      </div>

      <div className="glass-panel rounded-xl p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Modelo activo
        </p>
        <p className="text-sm font-semibold text-primary truncate">
          {metrics.model || 'No conectado'}
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="bg-surface-container-highest rounded-xl p-3.5 border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface-variant font-medium">Prompt</span>
            <span className="text-xs font-bold text-primary font-mono">
              {formatTokens(metrics.prompt_tokens)}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-background overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: metrics.total_tokens
                  ? `${Math.min((metrics.prompt_tokens / metrics.total_tokens) * 100, 100)}%`
                  : '0%',
              }}
            />
          </div>
        </div>
        <div className="bg-surface-container-highest rounded-xl p-3.5 border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface-variant font-medium">Completado</span>
            <span className="text-xs font-bold text-tertiary font-mono">
              {formatTokens(metrics.completion_tokens)}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-background overflow-hidden">
            <div
              className="h-full rounded-full bg-tertiary transition-all duration-500"
              style={{
                width: metrics.total_tokens
                  ? `${Math.min((metrics.completion_tokens / metrics.total_tokens) * 100, 100)}%`
                  : '0%',
              }}
            />
          </div>
        </div>
        <div className="bg-primary/10 rounded-xl p-3.5 border border-primary/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Total</span>
            <span className="text-sm font-bold text-primary font-mono">
              {formatTokens(metrics.total_tokens)}
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Tiempo respuesta</span>
          <span className="text-xs font-bold text-on-surface font-mono">
            {formatResponseTime(metrics.last_response_time)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Promedio</span>
          <span className="text-xs font-bold text-on-surface font-mono">
            {formatResponseTime(Math.round(avgTime))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-medium">Tokens/segundo</span>
          <span className="text-xs font-bold text-tertiary font-mono">
            {tps > 0 ? `${tps}/s` : '—'}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/60">
          <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          <span>Actualizado en tiempo real</span>
        </div>
      </div>
    </aside>
  );
}