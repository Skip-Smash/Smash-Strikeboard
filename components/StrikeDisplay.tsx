
import React from 'react';

interface StrikeDisplayProps {
  count: number;
}

const StrikeDisplay: React.FC<StrikeDisplayProps> = ({ count }) => {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-10 h-10 rounded flex items-center justify-center border-2 transition-all duration-300 ${
            i <= count
              ? 'bg-red-600 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse'
              : 'bg-slate-800 border-slate-700'
          }`}
        >
          <span className={`text-2xl font-black ${i <= count ? 'text-white' : 'text-slate-600'}`}>
            X
          </span>
        </div>
      ))}
    </div>
  );
};

export default StrikeDisplay;
