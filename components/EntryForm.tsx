
import React, { useState } from 'react';
import { EntryType, StudyEntry } from '../types';
import { Button } from './Button';
import { getTranslationSuggestion } from '../services/geminiService';

interface EntryFormProps {
  onAdd: (entry: Omit<StudyEntry, 'id' | 'date'>) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [type, setType] = useState<EntryType>('word');
  const [notes, setNotes] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !translation) return;
    
    onAdd({ text, translation, type, notes });
    setText('');
    setTranslation('');
    setNotes('');
  };

  const handleMagicFill = async () => {
    if (!text) return;
    setIsAiLoading(true);
    const suggestion = await getTranslationSuggestion(text, type);
    if (suggestion) {
      setTranslation(suggestion.translation);
      if (suggestion.example) {
        setNotes(`Example: ${suggestion.example}\n${suggestion.notes || ''}`);
      }
    }
    setIsAiLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Entry</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Text</label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Serendipity"
              required
            />
            <button
              type="button"
              onClick={handleMagicFill}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="AI Auto-fill"
              disabled={!text || isAiLoading}
            >
              {isAiLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Translation</label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. Tevafuk"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['word', 'idiom', 'sentence'] as EntryType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition-all uppercase tracking-tight ${
                  type === t 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Examples</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-20 resize-none"
            placeholder="Usage, pronunciation, synonyms..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full py-3">
        Save Entry
      </Button>
    </form>
  );
};
