'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [text]);

  function handleSubmit(): void {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex items-end gap-3">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          rows={1}
          disabled={disabled}
          aria-label="Mensaje para el asistente"
          className="w-full resize-none rounded-2xl bg-surface-container-high border border-white/10 px-5 py-3.5 pr-12 text-sm text-on-surface placeholder-on-surface-variant/50 outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || disabled}
        aria-label="Enviar mensaje"
        className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-on-primary transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-95"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.37 8.12a1 1 0 01.15-1.38l.67-.6a1 1 0 011.34.05L9 10.5V4a1 1 0 011-1h1a1 1 0 011 1v6.5l3.47-4.31a1 1 0 011.34-.05l.67.6a1 1 0 01.15 1.38L15 12l2.63 3.88a1 1 0 01-.15 1.38l-.67.6a1 1 0 01-1.34-.05L12 13.5V20a1 1 0 01-1 1h-1a1 1 0 01-1-1v-6.5l-3.47 4.31a1 1 0 01-1.34.05l-.67-.6a1 1 0 01-.15-1.38L6 12z"
          />
        </svg>
      </button>
    </div>
  );
}