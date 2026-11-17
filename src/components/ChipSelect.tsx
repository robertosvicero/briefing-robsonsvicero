import React from 'react';
import { Check } from 'lucide-react';

interface ChipSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const ChipSelect: React.FC<ChipSelectProps> = ({ options, selected, onChange }) => {
  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggleOption(opt)}
            className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              isSelected
                ? 'bg-accent-600 text-white shadow-sm ring-2 ring-accent-600 ring-offset-1'
                : 'bg-white text-ink-700 border border-surface-200 hover:border-accent-300 hover:bg-surface-50'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
};
