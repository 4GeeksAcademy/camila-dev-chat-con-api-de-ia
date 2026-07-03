'use client';

import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto chat-scrollbar px-4 py-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto chat-scrollbar px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex flex-col items-start gap-1.5 max-w-[88%] sm:max-w-[80%]">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-semibold tracking-wide uppercase text-on-surface-variant">
                Asistente IA
              </span>
            </div>
            <div className="glass-panel px-5 py-4 rounded-2xl rounded-tl-md">
              <Loader />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}