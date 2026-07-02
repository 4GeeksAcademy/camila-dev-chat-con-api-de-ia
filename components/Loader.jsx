export default function Loader() {
  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <div className="flex items-center gap-1.5">
        <span className="sr-only">La IA está pensando</span>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '-0.3s' }}
        />
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '-0.15s' }}
        />
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: '0s' }}
        />
      </div>
      <span className="text-xs font-medium text-on-surface-variant tracking-wide uppercase">
        Pensando...
      </span>
    </div>
  );
}