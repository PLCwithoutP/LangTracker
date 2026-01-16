
import React, { useState } from 'react';
import { EntryType, StudyEntry } from '../types';
import { Button } from './Button';

interface EntryFormProps {
  onAdd: (entry: Omit<StudyEntry, 'id' | 'date'>) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [type, setType] = useState<EntryType>('word');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !translation) return;
    
    onAdd({ text, translation, type, notes });
    setText('');
    setTranslation('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">New Entry</h3>
        <span className="w-2 h-2 rounded-full bg-indigo-500" />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Original Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
            placeholder="e.g. Abundance"
            required
          />
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
