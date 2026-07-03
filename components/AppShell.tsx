'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import MetricsPanel from './MetricsPanel';
import ErrorBanner from './ErrorBanner';
import { generateId } from '@/lib/helpers';
import { loadMessages, saveMessages, loadMetrics, saveMetrics, clearStorage } from '@/lib/storage';
import { accumulateMetrics } from '@/lib/metrics';
import type { Message } from '@/lib/storage';
import type { SessionMetrics } from '@/lib/metrics';

export default function AppShell() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
    response_times: [],
    model: '',
    last_response_time: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    const savedMessages = loadMessages();
    const savedMetrics = loadMetrics();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
    if (savedMetrics.total_tokens > 0 || savedMetrics.model) {
      setMetrics(savedMetrics);
    }
    setIsInitialized(true);
  }, []);

  // Persist messages and metrics on change (after initial load)
  useEffect(() => {
    if (isInitialized) {
      saveMessages(messages);
    }
  }, [messages, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveMetrics(metrics);
    }
  }, [metrics, isInitialized]);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      setMetrics((prev) =>
        accumulateMetrics(prev, {
          ...data.usage,
          model: data.model,
          response_time: data.response_time,
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el asistente');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const handleClear = useCallback(() => {
    setMessages([]);
    setMetrics({
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
      response_times: [],
      model: '',
      last_response_time: 0,
    });
    setError(null);
    clearStorage();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden">
      {/* Mobile topbar metrics */}
      <MetricsPanel metrics={metrics} variant="topbar" onClear={handleClear} />

      {/* Sidebar metrics panel (desktop) */}
      <MetricsPanel metrics={metrics} variant="sidebar" />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col pt-24 lg:pt-0">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between px-6 h-14 border-b border-white/5 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-on-surface">Asistente IA</span>
          </div>
          <button
            onClick={handleClear}
            className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container-higher"
          >
            Limpiar
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Error banner */}
          {error && (
            <div className="px-4 pt-4 mx-auto w-full max-w-3xl">
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          )}

          {/* Chat window */}
          <ChatWindow messages={messages} isLoading={isLoading} />

          {/* Input area */}
          <div className="border-t border-white/5 bg-surface/80 backdrop-blur-lg">
            <div className="mx-auto max-w-3xl px-4 py-4">
              <ChatInput onSend={handleSend} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
