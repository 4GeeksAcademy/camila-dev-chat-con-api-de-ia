export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function formatTime(date: string | number | Date): string {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatTokens(num: number | null | undefined): string {
  if (!num && num !== 0) return '—';
  return num.toLocaleString();
}

export function calculateTokensPerSecond(tokens: number, ms: number): number {
  if (!tokens || !ms || ms === 0) return 0;
  return Number((tokens / (ms / 1000)).toFixed(1));
}

export function formatResponseTime(ms: number | null | undefined): string {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}