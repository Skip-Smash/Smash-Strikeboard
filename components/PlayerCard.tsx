
import React from 'react';
import { Employee } from '../types';
import StrikeDisplay from './StrikeDisplay';

interface PlayerCardProps {
  employee: Employee;
  onAddStrikeRequest: (id: string) => void;
  onRemove: (id: string) => void;
  isTreating: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  employee, 
  onAddStrikeRequest, 
  onRemove,
  isTreating 
}) => {
  return (
    <div 
      className={`relative group bg-slate-900 border-2 rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 overflow-hidden flex flex-col h-full ${
        isTreating 
          ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] animate-pulse' 
          : 'border-slate-800 hover:border-red-500'
      }`}
    >
      {isTreating && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 px-3 py-1 font-bold text-xs rounded-bl-lg z-10">
          TRAKTEREN! 🍩
        </div>
      )}
      
      <div className="flex flex-col items-center text-center space-y-4 flex-grow">
        <h3 className="text-xl font-bold truncate w-full uppercase tracking-widest text-slate-100 font-bungee">
          {employee.name}
        </h3>

        <StrikeDisplay count={employee.strikes} />

        <div className="w-full flex-grow space-y-2 py-4">
          {employee.reasons && employee.reasons.length > 0 ? (
            employee.reasons.map((reason, idx) => (
              <div key={idx} className="text-[10px] leading-tight text-slate-400 italic bg-slate-800/50 p-2 rounded border-l-2 border-red-500 text-left">
                <span className="text-red-500 font-bold mr-1">#{idx + 1}:</span> {reason}
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-600 italic py-2">Nog geen overtredingen...</div>
          )}
        </div>

        <div className="flex gap-2 w-full pt-2">
          <button
            onClick={() => onAddStrikeRequest(employee.id)}
            disabled={employee.strikes >= 3}
            className={`flex-grow px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              employee.strikes >= 3 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg active:scale-90 shake-on-hover'
            }`}
          >
            + STRIKE UITDELEN
          </button>
        </div>
      </div>

      <button
        onClick={() => onRemove(employee.id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-white hover:bg-red-900 transition-all text-xs z-20"
      >
        ✕
      </button>
    </div>
  );
};

export default PlayerCard;
