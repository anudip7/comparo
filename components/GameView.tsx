
import React, { useState, useEffect, useMemo } from 'react';
import { PhotoPair } from '../types';

interface Props {
  pair: PhotoPair;
  onAnswer: (correct: boolean, choice: 'A' | 'B', correctChoice: 'A' | 'B') => void;
  onLoadError: (filename: string) => void;
  currentStep: number;
  totalSteps: number;
}

const GameView: React.FC<Props> = ({ pair, onAnswer, onLoadError, currentStep, totalSteps }) => {
  const [revealed, setRevealed] = useState(false);
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null);
  const [blobs, setBlobs] = useState<{ left: string; right: string }>({ left: '', right: '' });
  const [loading, setLoading] = useState(true);
  const [fullView, setFullView] = useState<'A' | 'B' | null>(null);

  const setup = useMemo(() => {
    const isIphoneLeft = Math.random() > 0.5;
    return {
      leftFile: isIphoneLeft ? pair.iphone : pair.sony,
      rightFile: isIphoneLeft ? pair.sony : pair.iphone,
      iphoneSide: (isIphoneLeft ? 'A' : 'B') as 'A' | 'B'
    };
  }, [pair]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    const fetchImageAsBlob = async (filename: string) => {
      try {
        const res = await fetch(filename);
        if (res.ok) return await res.blob();
        
        const encoded = encodeURIComponent(filename);
        const res2 = await fetch(encoded);
        if (res2.ok) return await res2.blob();
        
        throw new Error(`404: ${filename}`);
      } catch (e) {
        throw new Error(`Failed to fetch: ${filename}`);
      }
    };

    const loadImages = async () => {
      try {
        const [blobL, blobR] = await Promise.all([
          fetchImageAsBlob(setup.leftFile),
          fetchImageAsBlob(setup.rightFile)
        ]);
        
        if (active) {
          setBlobs({
            left: URL.createObjectURL(blobL),
            right: URL.createObjectURL(blobR)
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (active) onLoadError(err.message.split(': ')[1] || "Unknown File");
      }
    };

    loadImages();

    return () => {
      active = false;
      if (blobs.left) URL.revokeObjectURL(blobs.left);
      if (blobs.right) URL.revokeObjectURL(blobs.right);
    };
  }, [setup, onLoadError, pair.id]);

  useEffect(() => {
    setRevealed(false);
    setUserChoice(null);
    setFullView(null);
  }, [pair]);

  const handleChoice = (side: 'A' | 'B') => {
    if (revealed || loading) return;
    setUserChoice(side);
    setRevealed(true);
    setTimeout(() => {
      onAnswer(side === setup.iphoneSide, side, setup.iphoneSide);
    }, 1500);
  };

  const toggleFullView = (e: React.MouseEvent, side: 'A' | 'B') => {
    e.stopPropagation();
    setFullView(fullView === side ? null : side);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-bold tracking-widest uppercase text-[10px]">Processing Vision...</p>
        </div>
      </div>
    );
  }

  const renderImageSection = (side: 'A' | 'B') => {
    const isLeft = side === 'A';
    const isSelected = userChoice === side;
    const isIphone = setup.iphoneSide === side;
    const blobUrl = isLeft ? blobs.left : blobs.right;

    return (
      <div 
        onClick={() => handleChoice(side)}
        className={`relative flex-1 group cursor-pointer overflow-hidden transition-all duration-500 ease-out 
          ${isLeft ? 'border-b md:border-b-0 md:border-r' : ''} border-neutral-800/50
          ${revealed && isSelected ? 'z-20 scale-[1.01] shadow-2xl' : 'z-0'}`}
      >
        {/* Label A/B */}
        <div className="absolute top-4 left-4 z-40 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md text-white font-black text-sm md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-white/10 shadow-lg">
            {side}
          </div>
          {revealed && (
             <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <span className={`px-3 py-1.5 h-8 md:h-10 flex items-center rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg ${isIphone ? 'bg-green-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                  {isIphone ? 'iPhone' : 'Sony'}
                </span>
             </div>
          )}
        </div>

        {/* Full View Trigger */}
        {!revealed && (
          <button 
            onClick={(e) => toggleFullView(e, side)}
            className="absolute top-4 right-4 z-40 bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-full border border-white/10 transition-all active:scale-90"
            title="Inspect Full Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center bg-neutral-950">
          <img src={blobUrl} alt="" className="w-full h-full object-contain pointer-events-none" />
        </div>
        
        {!revealed && <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-h-screen w-full overflow-hidden bg-black">
      {/* Header */}
      <div className="bg-neutral-900/95 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-neutral-700 flex items-center justify-center bg-black">
            <span className="text-blue-500 font-black text-xs md:text-sm">{currentStep}</span>
          </div>
          <div>
            <span className="text-neutral-300 text-[10px] font-bold uppercase tracking-[0.2em] block">Tap on the iPhone Shot</span>
            <h2 className="text-xs md:text-sm font-black text-white leading-tight uppercase tracking-widest">{currentStep} of {totalSteps}</h2>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-[0.2em] block">Subject</span>
          <h2 className="text-xs md:text-sm font-black text-blue-400 leading-tight uppercase tracking-widest">{pair.category}</h2>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="flex-1 flex flex-col md:flex-row relative min-h-0 w-full overflow-hidden">
        {renderImageSection('A')}
        {renderImageSection('B')}

        {/* Global Feedback Overlay */}
        {revealed && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center animate-in zoom-in duration-300">
            <div className={`p-8 md:p-12 rounded-full border-4 ${userChoice === setup.iphoneSide ? 'bg-green-600/90 border-green-400' : 'bg-red-600/90 border-red-400'} shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-sm`}>
               {userChoice === setup.iphoneSide ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-20 md:w-20 text-white" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-20 md:w-20 text-white" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <div className="bg-neutral-900 shrink-0 border-t border-neutral-800 px-6 py-4 md:py-6 flex items-center justify-center z-30">
        <p className="text-white font-black text-sm md:text-lg tracking-tight text-center uppercase">
          {revealed ? (userChoice === setup.iphoneSide ? 'Optical Perfection' : 'Tricked by the Sensor') : 'Tap the iPhone Shot'}
        </p>
      </div>

      {/* Full Inspection Modal */}
      {fullView && (
        <div 
          className="fixed overflow-hidden inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 flex flex-col"
          onClick={() => setFullView(null)}
        >
          <div className="flex justify-between items-center p-6 shrink-0">
             <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10">
               <span className="text-white font-black text-sm tracking-widest uppercase">Sample {fullView}</span>
             </div>
             <button className="bg-white text-black p-2 rounded-full active:scale-90 transition-transform">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
          <div className="flex-1 overflow-hidden p-2 md:p-8">
            <img 
              src={fullView === 'A' ? blobs.left : blobs.right} 
              alt="Inspection" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="p-8 text-center">
            <p className="text-red-400 pb-2 font-bold uppercase tracking-[0.3em] text-[12px]">No pixel peeping!</p>
            <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[10px]">Tap anywhere to close inspection</p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;
