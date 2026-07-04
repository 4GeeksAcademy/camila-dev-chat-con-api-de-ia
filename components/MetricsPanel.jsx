'use client';

import { formatTokens, formatResponseTime, calculateTokensPerSecond } from '@/lib/helpers';

function MetricsContent({ metrics, mobile = false }) {
  const cardClass = mobile
    ? 'bg-surface-container-high rounded-xl p-3 border border-white/8'
    : 'bg-surface-container-highest rounded-xl p-3.5 border border-white/5';

  const labelClass = mobile
    ? 'text-[11px] text-on-surface-variant font-medium'
    : 'text-xs text-on-surface-variant font-medium';

  const valueClass = mobile
    ? 'text-[11px] font-bold text-primary font-mono'
    : 'text-xs font-bold text-primary font-mono';

  const completionValueClass = mobile
    ? 'text-[11px] font-bold text-tertiary font-mono'
    : 'text-xs font-bold text-tertiary font-mono';

  return (
    <>
      <div className="glass-panel rounded-xl p-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Modelo activo
        </p>
        <p className="text-sm font-semibold text-primary truncate">
          {metrics.model || 'llama-3.3-70b-versatile'}
        </p>
      </div>

      <div className="space-y-2.5">
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-1">
            <span className={labelClass}>Prompt</span>
            <span className={valueClass}>
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

        <div className={cardClass}>
          <div className="flex items-center justify-between mb-1">
            <span className={labelClass}>Completado</span>
            <span className={completionValueClass}>
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
    </>
  );
}

export default function MetricsPanel({ metrics, mode = 'desktop' }) {
  if (!metrics) return null;

  const avgTime = metrics.response_times?.length
    ? metrics.response_times.reduce((a, b) => a + b, 0) / metrics.response_times.length
    : 0;

  const tps = calculateTokensPerSecond(
    metrics.completion_tokens || 0,
    metrics.last_response_time || 0
  );

  if (mode === 'mobile') {
    return (
      <section className="px-4 py-3 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-on-surface tracking-tight">Métricas de sesión</h3>
        </div>

        <MetricsContent metrics={metrics} mobile />

        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-panel rounded-xl p-3 space-y-1">
            <p className="text-[10px] text-on-surface-variant font-medium">Tiempo respuesta</p>
            <p className="text-xs font-bold text-on-surface font-mono">{formatResponseTime(metrics.last_response_time)}</p>
          </div>
          <div className="glass-panel rounded-xl p-3 space-y-1">
            <p className="text-[10px] text-on-surface-variant font-medium">Promedio</p>
            <p className="text-xs font-bold text-on-surface font-mono">{formatResponseTime(Math.round(avgTime))}</p>
          </div>
          <div className="glass-panel rounded-xl p-3 space-y-1 col-span-2">
            <p className="text-[10px] text-on-surface-variant font-medium">Tokens/segundo</p>
            <p className="text-xs font-bold text-tertiary font-mono">{tps > 0 ? `${tps}/s` : '—'}</p>
          </div>
        </div>
      </section>
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

      <MetricsContent metrics={metrics} />

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