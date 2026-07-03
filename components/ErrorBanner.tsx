'use client';

interface ErrorBannerProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/20 backdrop-blur-sm animate-fadeIn">
      <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-300">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-red-400 hover:text-red-200 transition-colors p-1 rounded hover:bg-red-950/60"
          aria-label="Descartar error"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}