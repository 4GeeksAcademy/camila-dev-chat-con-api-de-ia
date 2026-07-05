export default function EmptyState({ onSuggestionSelect, isLoading = false }) {
  const hints = [
    '¿Qué es Levante?',
    '¿Qué es la masa madre?',
    '¿Cuánto cuesta un pan de masa madre?',
  ];

  const handleSuggestionClick = (hint) => {
    if (!onSuggestionSelect || isLoading) {
      return;
    }

    onSuggestionSelect(hint);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        <svg
          className="w-8 h-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-on-surface mb-2">
        Soy un asistente IA impulsado por Llama 3 en Groq. Pregúntame lo que necesites sobre Levante.
      </h2>
      <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
        Estas son algunas preguntas sugeridas:
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {hints.map((hint) => (
          <button
            key={hint}
            type="button"
            onClick={() => handleSuggestionClick(hint)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-container-highest text-on-surface-variant border border-white/5 transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}