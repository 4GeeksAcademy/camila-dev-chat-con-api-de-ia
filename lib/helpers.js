export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function formatTime(date) {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatTokens(num) {
  if (!num && num !== 0) return '—';
  return num.toLocaleString();
}

export function calculateTokensPerSecond(tokens, ms) {
  if (!tokens || !ms || ms === 0) return 0;
  return (tokens / (ms / 1000)).toFixed(1);
}

export function formatResponseTime(ms) {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
