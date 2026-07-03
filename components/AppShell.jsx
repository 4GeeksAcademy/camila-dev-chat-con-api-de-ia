'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import MetricsPanel from './MetricsPanel';
import ErrorBanner from './ErrorBanner';
import { generateId } from '@/lib/helpers';
import { loadMessages, saveMessages, loadMetrics, saveMetrics, clearStorage } from '@/lib/storage';
import { accumulateMetrics } from '@/lib/metrics';

export default function AppShell() {
  const [messages, setMessages] = useState([]);
  const [metrics, setMetrics] = useState({
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0,
    response_times: [],
    model: '',
    last_response_time: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSend = useCallback(async (content) => {
    const userMessage = {
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

      const assistantMessage = {
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
      setError(err.message || 'Error al conectar con el asistente');
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
      {/* Mobile header with metrics */}
      <div className="fixed top-0 inset-x-0 z-30 lg:hidden bg-surface/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h1 className="text-sm font-bold text-primary">Asistente IA</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded-md">
              {metrics.total_tokens > 0 ? `${metrics.total_tokens.toLocaleString()} tok` : '0 tok'}
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] font-semibold text-on-surface-variant hover:text-red-400 transition-colors px-2 py-1 rounded-md hover:bg-red-950/30"
              aria-label="Borrar conversación"
            >
              Borrar
            </button>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pt-0 pt-14">
        {/* Desktop header */}
        <header className="hidden lg:flex items-center h-16 px-6 border-b border-white/10 bg-surface/80 backdrop-blur-lg shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary">Asistente IA</h1>
              <p className="text-[10px] font-medium text-on-surface-variant/60">
                Impulsado por Llama 3 · Groq
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:text-red-400 transition-all rounded-lg hover:bg-red-950/20 border border-transparent hover:border-red-500/20"
              aria-label="Borrar conversación"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Borrar conversación
            </button>
          </div>
        </header>

        {/* Chat window */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Error banner */}
        {error && (
          <div className="px-4 pb-2 mx-auto w-full max-w-3xl">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Input area */}
        <div className="shrink-0 border-t border-white/10 bg-surface/80 backdrop-blur-lg">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <ChatInput onSend={handleSend} disabled={isLoading} />
            <p className="mt-2 text-[10px] text-center text-on-surface-variant/40">
              Enter para enviar · Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      </div>

      {/* Desktop metrics panel */}
      <MetricsPanel metrics={metrics} />
    </div>
  );
}