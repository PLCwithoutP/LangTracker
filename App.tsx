
import React, { useState, useEffect, useMemo } from 'react';
import { StudyEntry } from './types';
import { Header } from './components/Header';
import { EntryForm } from './components/EntryForm';
import { StudyChart } from './components/StudyChart';
import { Button } from './components/Button';

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
      id: crypto.randomUUID(),
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
    return entries.filter(entry => {
      const matchesSearch = 
        entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.translation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || entry.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [entries, searchQuery, filterType]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(e => e.date.split('T')[0] === today).length;
    return {
      total: entries.length,
      today: todayEntries,
      avg: entries.length > 0 ? (entries.length / 30).toFixed(1) : 0
    };
  }, [entries]);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Area - Now 3/12 columns */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/70 text-xs uppercase font-semibold">Total Entries</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/70 text-xs uppercase font-semibold">Today's Log</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
              </div>
            </div>

            <EntryForm onAdd={addEntry} />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start" onClick={exportData}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export JSON
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="secondary" className="w-full justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import JSON
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Now 8/12 or 9/12 columns */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <StudyChart entries={entries} />

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 sticky top-4 z-10">
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search entries or translations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'word', 'idiom', 'sentence'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                      filterType === t 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Entry List */}
            <div className="space-y-4">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group animate-fadeIn"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            entry.type === 'word' ? 'bg-blue-50 text-blue-600' :
                            entry.type === 'idiom' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {entry.type}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 leading-tight">{entry.text}</h4>
                        <p className="text-indigo-600 font-medium mt-1">{entry.translation}</p>
                        {entry.notes && (
                          <p className="text-gray-500 text-sm mt-3 border-l-2 border-gray-100 pl-3 py-1 italic">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No entries found</h3>
                  <p className="text-gray-500">Try adjusting your search or add your first study item.</p>
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
