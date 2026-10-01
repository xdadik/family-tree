import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { Language } from '../../utils/translations';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setIsLanguageModalOpen, language, setLanguage, t } = useFamily();

  if (!isLanguageModalOpen) return null;

  const languages: { id: Language; label: string; sub: string }[] = [
    { id: 'uz-latn', label: 'O\'zbekcha', sub: 'O\'zbek tili (Lotin yozuvi)' },
    { id: 'uz-cyrl', label: 'Ўзбекча', sub: 'Ўзбек тили (Кирилл ёзуви)' },
    { id: 'en', label: 'English', sub: 'English (US / UK)' },
    { id: 'ru', label: 'Русский', sub: 'Русский язык' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{t.selectLanguage}</h3>
          </div>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="min-w-[44px] min-h-[44px] p-1 rounded-full text-neutral-400 hover:text-black dark:hover:text-white flex items-center justify-center"
            aria-label={t.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          {languages.map((lang) => {
            const isSelected = language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  setIsLanguageModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-sm font-bold'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-750'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{lang.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'opacity-80' : 'text-neutral-500'}`}>
                    {lang.sub}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
