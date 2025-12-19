
import React, { useState, useEffect } from 'react';
import { Employee } from './types';
import PlayerCard from './components/PlayerCard';
import { generateStrikeReason, generateTreatCelebration } from './services/geminiService';

const STORAGE_KEY = 'smash_studios_strikes_v4';

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Niels', strikes: 0, reasons: [] },
  { id: '2', name: 'Pieter', strikes: 0, reasons: [] },
  { id: '3', name: 'Geert', strikes: 0, reasons: [] },
  { id: '4', name: 'Michiel', strikes: 0, reasons: [] },
  { id: '5', name: 'Skip', strikes: 0, reasons: [] },
  { id: '6', name: 'Sherin', strikes: 0, reasons: [] },
  { id: '7', name: 'Jari', strikes: 0, reasons: [] },
  { id: '8', name: 'Jurre', strikes: 0, reasons: [] },
  { id: '9', name: 'Lars', strikes: 0, reasons: [] },
  { id: '10', name: 'Pim', strikes: 0, reasons: [] },
  { id: '11', name: 'Chantal', strikes: 0, reasons: [] },
  { id: '12', name: 'Cas', strikes: 0, reasons: [] },
  { id: '13', name: 'Mick', strikes: 0, reasons: [] },
];

type ViewMode = 'scoreboard' | 'admin';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('scoreboard');
  const [newName, setNewName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  
  // Strike Modal State
  const [strikeTargetId, setStrikeTargetId] = useState<string | null>(null);
  const [strikeReason, setStrikeReason] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEmployees(JSON.parse(saved));
    } else {
      setEmployees(DEFAULT_EMPLOYEES);
    }
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees]);

  const handleAddStrike = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!strikeTargetId) return;

    const finalReason = strikeReason.trim() || "Geen reden opgegeven.";
    const employee = employees.find(emp => emp.id === strikeTargetId);
    
    if (!employee) return;

    setEmployees(prev => prev.map(emp => {
      if (emp.id === strikeTargetId) {
        const nextStrikes = emp.strikes + 1;
        const nextReasons = [...(emp.reasons || []), finalReason];
        return { ...emp, strikes: nextStrikes, reasons: nextReasons };
      }
      return emp;
    }));

    if (employee.strikes === 2) {
      const celebMsg = await generateTreatCelebration(employee.name);
      setNotification(celebMsg);
      setTimeout(() => setNotification(null), 10000);
    }

    setStrikeTargetId(null);
    setStrikeReason('');
  };

  const handleMagicReason = async () => {
    if (!strikeTargetId) return;
    const emp = employees.find(e => e.id === strikeTargetId);
    if (!emp) return;

    setIsGenerating(true);
    const magic = await generateStrikeReason(emp.name);
    setStrikeReason(magic);
    setIsGenerating(false);
  };

  const resetStrikes = (id: string) => {
    setEmployees(prev => prev.map(e => 
      e.id === id ? { ...e, strikes: 0, reasons: [] } : e
    ));
  };

  const resetAllStrikes = () => {
    if (confirm('Wil je echt ALLE strikes van IEDEREEN wissen?')) {
      setEmployees(prev => prev.map(e => ({ ...e, strikes: 0, reasons: [] })));
    }
  };

  const updateEmployeeName = (id: string, name: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, name } : e));
  };

  const removeEmployee = (id: string) => {
    if (confirm('Weet je zeker dat je deze persoon wilt verwijderen?')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || employees.length >= 15) return;
    
    const newEmp: Employee = {
      id: Date.now().toString(),
      name: newName.trim(),
      strikes: 0,
      reasons: []
    };
    
    setEmployees(prev => [...prev, newEmp]);
    setNewName('');
    setIsAddingEmployee(false);
  };

  const targetEmployee = employees.find(e => e.id === strikeTargetId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Navigation & Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col items-center relative">
        <button 
          onClick={() => setViewMode(viewMode === 'scoreboard' ? 'admin' : 'scoreboard')}
          className="absolute right-0 top-0 p-3 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 hover:border-slate-600 transition-all group z-50"
          title={viewMode === 'scoreboard' ? 'Beheer' : 'Terug naar Scorebord'}
        >
          {viewMode === 'scoreboard' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          )}
        </button>

        <div className="relative inline-block mb-4">
          <h1 className="text-4xl md:text-6xl font-black font-bungee tracking-tighter italic strike-glow text-red-600 uppercase transform -skew-x-12">
            Smash Studios
          </h1>
          <div className="absolute -bottom-2 right-0 bg-white text-black font-black px-2 text-sm uppercase transform skew-x-12 shadow-lg">
            {viewMode === 'scoreboard' ? 'Strike Scoreboard' : 'Beheer Paneel'}
          </div>
        </div>
        
        {viewMode === 'scoreboard' && (
          <p className="text-slate-400 font-medium text-center max-w-lg mt-6">
            Krijg je 3 strikes? Dan is het tijd om te <span className="text-yellow-400 font-bold underline italic">TRAKTEREN</span>. 
          </p>
        )}
      </header>

      {/* Notification Area */}
      {notification && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] bg-yellow-400 text-slate-900 font-black py-4 px-8 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.5)] border-4 border-white animate-bounce text-xl text-center max-w-md">
          🎉 {notification} 🎉
        </div>
      )}

      {/* Main Content Switcher */}
      {viewMode === 'scoreboard' ? (
        <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {employees.map(emp => (
            <PlayerCard 
              key={emp.id} 
              employee={emp} 
              onAddStrikeRequest={setStrikeTargetId}
              onRemove={removeEmployee}
              isTreating={emp.strikes >= 3}
            />
          ))}

          {/* Add Button Placeholder */}
          {employees.length < 15 && (
            <div 
              onClick={() => setIsAddingEmployee(true)}
              className="border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-slate-400 hover:bg-slate-900/50 cursor-pointer transition-all group min-h-[250px]"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors mb-2">
                <span className="text-3xl font-bold">+</span>
              </div>
              <span className="text-slate-500 font-bold group-hover:text-slate-300 uppercase tracking-tighter">Iemand toevoegen</span>
              <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest">({employees.length}/15)</span>
            </div>
          )}
        </main>
      ) : (
        <main className="max-w-4xl mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-2xl font-black font-bungee text-white italic">INSTELLINGEN</h2>
              <p className="text-slate-500 text-sm font-bold">Reset strikes of pas namen aan</p>
            </div>
            <button 
              onClick={resetAllStrikes}
              className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-900/50 px-6 py-3 rounded-xl font-black transition-all text-sm uppercase tracking-widest"
            >
              Reset Alles
            </button>
          </div>

          <div className="space-y-4">
            {employees.map(emp => (
              <div key={emp.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 group hover:border-slate-700 transition-all">
                <div className="flex-grow">
                  <input 
                    type="text"
                    value={emp.name}
                    onChange={(e) => updateEmployeeName(emp.id, e.target.value)}
                    className="bg-transparent text-xl font-bold text-white focus:outline-none focus:text-red-500 transition-colors w-full"
                  />
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-3 h-3 rounded-full ${i <= emp.strikes ? 'bg-red-500' : 'bg-slate-700'}`} />
                    ))}
                    <span className="text-[10px] text-slate-500 ml-2 uppercase font-black">{emp.strikes} strikes</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => resetStrikes(emp.id)}
                  disabled={emp.strikes === 0}
                  className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition-all ${
                    emp.strikes === 0 
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                    : 'bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white'
                  }`}
                >
                  Reset Strikes
                </button>

                <button 
                  onClick={() => removeEmployee(emp.id)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setViewMode('scoreboard')}
            className="w-full mt-10 bg-white text-slate-900 py-4 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Klaar met aanpassen
          </button>
        </main>
      )}

      {/* STRIKE MODAL (Zelfde als voorheen) */}
      {strikeTargetId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-900 border-4 border-red-600 rounded-3xl p-8 max-w-md w-full shadow-[0_0_100px_rgba(220,38,38,0.4)] transform animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black text-red-500 italic uppercase font-bungee leading-none">OFFICIËLE STRIKE</h2>
                <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">VOOR: <span className="text-white underline">{targetEmployee?.name}</span></p>
              </div>
              <div className="bg-red-600 text-white font-black px-3 py-1 text-xl italic shadow-lg shadow-red-900/50">
                #{ (targetEmployee?.strikes || 0) + 1 }
              </div>
            </div>

            <form onSubmit={handleAddStrike} className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Reden voor overtreding</label>
                <textarea 
                  autoFocus
                  rows={3}
                  value={strikeReason}
                  onChange={(e) => setStrikeReason(e.target.value)}
                  placeholder="Wat is er gebeurd?"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl px-4 py-3 text-white focus:border-red-600 outline-none transition-all resize-none"
                />
                <button
                  type="button"
                  onClick={handleMagicReason}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 p-2 bg-slate-800 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-all"
                  title="Genereer absurde AI reden"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => {setStrikeTargetId(null); setStrikeReason('');}}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors uppercase text-xs"
                >
                  Annuleren
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 px-4 py-3 rounded-xl font-black text-white shadow-lg shadow-red-900/40 active:scale-95 transition-all uppercase text-xs"
                >
                  Bevestig Strike
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal (Zelfde als voorheen) */}
      {isAddingEmployee && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-widest text-slate-100 italic">Nieuw Teamlid</h2>
            <form onSubmit={addEmployee} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Naam</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Naam..."
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl px-4 py-3 text-lg focus:border-red-600 outline-none transition-all"
                  maxLength={15}
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddingEmployee(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                >
                  ANNULEER
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-slate-100 hover:bg-white px-4 py-3 rounded-xl font-black text-slate-900 shadow-lg active:scale-95 transition-all"
                >
                  TOEVOEGEN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto mt-20 text-center pb-12 border-t border-slate-900 pt-8">
        <div className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
          Designed for Smash Studios &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default App;
