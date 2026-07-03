export interface SessionMetrics {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  response_times: number[];
  model: string;
  last_response_time: number;
}

export interface CurrentMetrics {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  model?: string;
  response_time?: number;
}

export function accumulateMetrics(
  prev: SessionMetrics,
  current: CurrentMetrics | null | undefined
): SessionMetrics {
  if (!current) return prev;

  const responseTimes = [...(prev.response_times || []), current.response_time || 0];
  // Keep only last 100 response times
  if (responseTimes.length > 100) responseTimes.shift();

  return {
    prompt_tokens: (prev.prompt_tokens || 0) + (current.prompt_tokens || 0),
    completion_tokens: (prev.completion_tokens || 0) + (current.completion_tokens || 0),
    total_tokens: (prev.total_tokens || 0) + (current.total_tokens || 0),
    response_times: responseTimes,
    model: current.model || prev.model || '',
    last_response_time: current.response_time || prev.last_response_time || 0,
  };
}