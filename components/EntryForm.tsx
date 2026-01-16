
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
    <form onSubmit={handleSubmit} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">New Entry</h3>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Original Text</label>
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
              placeholder="e.g. Abundance"
              required
            />
            <button
              type="button"
              onClick={handleMagicFill}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              disabled={!text || isAiLoading}
            >
              {isAiLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Translation</label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
            placeholder="e.g. Bolluk"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Category</label>
          {/* Increased gap between buttons (gap-3 instead of gap-1.5) and ensured no overlap */}
          <div className="grid grid-cols-3 gap-3">
            {(['word', 'idiom', 'sentence'] as EntryType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 px-1 text-[10px] font-black rounded-xl border-2 transition-all uppercase tracking-tight truncate ${
                  type === t 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' 
                    : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Notes / Context</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium min-h-[100px] resize-none"
            placeholder="Add context, synonyms or examples..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full py-4 text-xs font-black tracking-widest uppercase shadow-indigo-200 shadow-xl">
        ADD TO COLLECTION
      </Button>
    </form>
  );
};
