import type { SessionMetrics } from './metrics';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  messages: 'camila_chat_messages',
  metrics: 'camila_chat_metrics',
};

export function loadMessages(): Message[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.messages);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  } catch {
    // Storage full or unavailable
  }
}

export function loadMetrics(): SessionMetrics {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.metrics);
    return data
      ? JSON.parse(data)
      : {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          response_times: [],
          model: '',
          last_response_time: 0,
        };
  } catch {
    return {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
      response_times: [],
      model: '',
      last_response_time: 0,
    };
  }
}

export function saveMetrics(metrics: SessionMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEYS.metrics, JSON.stringify(metrics));
  } catch {
    // Storage full or unavailable
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.messages);
    localStorage.removeItem(STORAGE_KEYS.metrics);
  } catch {
    // Unavailable
  }
}