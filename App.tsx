
import React, { useState, useCallback, useEffect } from 'react';
import { getShuffledPairs } from './constants';
import { GameState, Screen, PhotoPair } from './types';
import LandingScreen from './components/LandingScreen';
import GameView from './components/GameView';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [pairs, setPairs] = useState<PhotoPair[]>([]);
  const [missingFiles, setMissingFiles] = useState<string[]>([]);
  const [game, setGame] = useState<GameState>({
    currentIndex: 0,
    score: 0,
    isGameOver: false,
    history: []
  });

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const startGame = useCallback(() => {
    const newPairs = getShuffledPairs();
    setPairs(newPairs);
    setMissingFiles([]);
    setGame({
      currentIndex: 0,
      score: 0,
      isGameOver: false,
      history: []
    });
    setScreen('playing');
  }, []);

  const handleAnswer = useCallback((wasCorrect: boolean, choice: 'A' | 'B', correct: 'A' | 'B') => {
    setGame(prev => {
      const newScore = wasCorrect ? prev.score + 1 : prev.score;
      const nextIndex = prev.currentIndex + 1;
      const isOver = nextIndex >= pairs.length;

      return {
        ...prev,
        score: newScore,
        currentIndex: nextIndex,
        isGameOver: isOver,
        history: [
          ...prev.history,
          { pairId: pairs[prev.currentIndex].id, wasCorrect, userChoice: choice, correctChoice: correct }
        ]
      };
    });
  }, [pairs]);

  const handleSkipPair = useCallback((filename: string) => {
    setMissingFiles(prev => [...new Set([...prev, filename])]);
    setPairs(prevPairs => {
      const updatedPairs = [...prevPairs];
      const currentIdx = game.currentIndex;
      updatedPairs.splice(currentIdx, 1);
      
      if (updatedPairs.length === 0) {
         // If we have NO pairs left, we don't trigger game over yet, 
         // we let the UI show the missing assets error.
      } else if (currentIdx >= updatedPairs.length) {
         setGame(g => ({ ...g, isGameOver: true }));
      }
      return updatedPairs;
    });
  }, [game.currentIndex]);

  useEffect(() => {
    if (game.isGameOver && screen === 'playing') {
      setScreen('result');
    }
  }, [game.isGameOver, screen]);

  if (screen === 'playing' && pairs.length === 0 && missingFiles.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black p-10 text-center">
        <h2 className="text-2xl font-black text-red-500 mb-4 uppercase tracking-tighter">Images Not Found</h2>
        <p className="text-neutral-400 max-w-md mb-8">
          The app couldn't find your photos. Ensure the following files are in the same folder as <code className="text-white">index.html</code>:
        </p>
        <div className="bg-neutral-900 p-4 rounded-lg text-left w-full max-w-sm mb-8 max-h-48 overflow-y-auto">
          {missingFiles.map(f => (
            <div key={f} className="text-xs text-neutral-500 font-mono mb-1">• {f}</div>
          ))}
        </div>
        <button onClick={() => setScreen('landing')} className="px-8 py-3 bg-white text-black font-bold rounded-lg uppercase text-xs tracking-widest">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-500 overflow-hidden">
      {screen === 'landing' && <LandingScreen onStart={startGame} />}
      
      {screen === 'playing' && !game.isGameOver && pairs.length > 0 && (
        <GameView 
          pair={pairs[game.currentIndex]} 
          onAnswer={handleAnswer}
          onLoadError={handleSkipPair}
          currentStep={game.currentIndex + 1}
          totalSteps={pairs.length}
        />
      )}

      {screen === 'result' && (
        <ResultScreen 
          score={game.score} 
          total={game.history.length} 
          onRestart={startGame} 
        />
      )}
    </div>
  );
};

export default App;
