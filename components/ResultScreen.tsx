
import React from 'react';

interface Props {
  score: number;
  total: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<Props> = ({ score, total, onRestart }) => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  
  const getFeedback = () => {
    if (total === 0) return "No data available.";
    if (percentage === 100) return "Master Visionary! You can't be fooled.";
    if (percentage >= 80) return "Impressive! You have a keen eye for optics.";
    if (percentage >= 50) return "Not bad. But computational photography is getting good.";
    return "The machines are winning. Keep practicing!";
  };

  const size = 280; // Larger container
  const center = size / 2;
  const strokeWidth = 12;
  const radius = (size / 2) - 30; // More breathing room to prevent cutting
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (total > 0 ? score / total : 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-8 text-center animate-in zoom-in duration-500 overflow-y-auto overflow-x-hidden">
      <div className="mb-8 relative flex items-center justify-center">
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90 block drop-shadow-2xl"
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-neutral-800"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-blue-500 transition-all duration-[1500ms] ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl font-black text-white leading-none tracking-tighter">{score}</span>
          <span className="text-neutral-500 uppercase font-black tracking-[0.2em] text-[10px] mt-2">out of {total}</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Challenge Complete</h1>
      <p className="text-lg md:text-xl text-blue-400 font-bold mb-10 max-w-sm mx-auto">{getFeedback()}</p>
      
      <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 max-w-xs w-full mb-10 mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Accuracy</span>
          <span className="text-white font-black text-sm">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-[1500ms]" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <button 
        onClick={onRestart}
        className="bg-white text-black font-black py-4 px-10 rounded-xl text-lg hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl"
      >
        Try Again
      </button>
    </div>
  );
};

export default ResultScreen;
