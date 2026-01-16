
import React, { useState, useEffect, useMemo } from 'react';
import { StudyEntry } from './types';
import { Header } from './components/Header';
import { EntryForm } from './components/EntryForm';
import { StudyChart } from './components/StudyChart';
import { Button } from './components/Button';

const generateId = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'word' | 'idiom' | 'sentence'>('all');

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lang_study_data');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('lang_study_data', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (newEntry: Omit<StudyEntry, 'id' | 'date'>) => {
    const entry: StudyEntry = {
      ...newEntry,
      id: generateId(),
      date: new Date().toISOString(),
    };
    setEntries(prev => [entry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lang_study.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          setEntries(data);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const filteredEntries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return entries.filter(entry => {
      const matchesSearch = 
        entry.text.toLowerCase().includes(query) ||
        entry.translation.toLowerCase().includes(query);
      
      const matchesType = filterType === 'all' || entry.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [entries, searchQuery, filterType]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(e => e.date.split('T')[0] === today).length;
    return {
      total: entries.length,
      today: todayEntries
    };
  }, [entries]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <Header />
      
      {/* Container max-width increased and alignment adjusted to move "left" parts more left */}
      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Area - Shifted left */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
              <h2 className="text-lg font-bold mb-4 opacity-90 tracking-wide uppercase text-xs">Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-white/60 text-[10px] uppercase font-bold mb-1">Total</p>
                  <p className="text-3xl font-black">{stats.total}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-white/60 text-[10px] uppercase font-bold mb-1">Today</p>
                  <p className="text-3xl font-black">{stats.today}</p>
                </div>
              </div>
            </div>

            <EntryForm onAdd={addEntry} />

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Storage</h3>
              <div className="flex flex-col gap-3">
                <Button variant="secondary" className="w-full justify-start text-xs font-bold" onClick={exportData}>
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  BACKUP DATA
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="secondary" className="w-full justify-start text-xs font-bold">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    RESTORE JSON
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <StudyChart entries={entries} />

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 sticky top-4 z-20 backdrop-blur-sm bg-white/90">
              <div className="relative flex-1">
                <svg className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Quick search words or translations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
                />
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['all', 'word', 'idiom', 'sentence'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t as any)}
                    className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-tighter whitespace-nowrap ${
                      filterType === t 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500" />
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        entry.type === 'word' ? 'bg-blue-50 text-blue-600' :
                        entry.type === 'idiom' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {entry.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-bold">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="text-xl font-black text-slate-900 leading-none mb-1 break-words">{entry.text}</h4>
                      <p className="text-indigo-600 font-bold text-lg mb-4">{entry.translation}</p>
                      
                      {entry.notes && (
                        <div className="pt-4 border-t border-slate-50">
                          <p className="text-slate-500 text-sm leading-relaxed italic line-clamp-3">
                            {entry.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nothing found in your study journal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
