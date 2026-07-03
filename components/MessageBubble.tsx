import { formatTime } from '@/lib/helpers';
import type { Message } from '@/lib/storage';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex flex-col gap-1.5 ${isUser ? 'items-end ml-auto' : 'items-start'} max-w-[88%] sm:max-w-[80%] animate-fadeIn`}
    >
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] font-semibold tracking-wide uppercase text-on-surface-variant">
          {isUser ? 'Tú' : 'Asistente IA'}
        </span>
        <span className="text-[10px] font-medium text-on-surface-variant/60">
          {formatTime(message.timestamp)}
        </span>
      </div>
      <div
        className={`px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-on-primary rounded-2xl rounded-tr-md shadow-lg shadow-primary/20'
            : 'glass-panel text-on-surface rounded-2xl rounded-tl-md shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}