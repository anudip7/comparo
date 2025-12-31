
import React from 'react';

interface Props {
  onStart: () => void;
}

const LandingScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 bg-black">
      <div className="mb-6 p-5 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-900/30 rotate-3 transform">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 text-white uppercase italic">
        SHOT ON <span className="text-blue-500 not-italic">WHAT?</span>
      </h1>
      
      <p className="max-w-md md:max-w-2xl text-base md:text-xl text-neutral-500 mb-12 leading-relaxed px-4">
        Can you spot the difference between <span className="text-white font-bold italic">computational photography</span> and a <span className="text-white font-bold italic">full-frame sensor?</span>
      </p>

      <div className="flex flex-col space-y-6 w-full max-w-xs md:max-w-sm">
        <button 
          onClick={onStart}
          className="bg-white text-black font-black py-5 px-8 rounded-2xl text-lg md:text-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5 uppercase tracking-tight"
        >
          Begin Challenge
        </button>
        
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-12 bg-neutral-800"></div>
          <p className="text-[9px] md:text-[10px] text-neutral-600 uppercase tracking-[0.4em] font-black">
            Optimized for detail inspection
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
