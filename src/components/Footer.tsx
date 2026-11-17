import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-surface-200 bg-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-500 gap-4">
        <p>© {new Date().getFullYear()} Robson Svicero. Todos os direitos reservados.</p>
        <p>Suas informações são confidenciais e usadas estritamente para o planejamento do projeto.</p>
      </div>
    </footer>
  );
};
