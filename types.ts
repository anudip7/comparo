
export interface PhotoPair {
  id: number;
  iphone: string;
  sony: string;
  category: string;
}

export interface GameState {
  currentIndex: number;
  score: number;
  isGameOver: boolean;
  history: {
    pairId: number;
    wasCorrect: boolean;
    userChoice: 'A' | 'B';
    correctChoice: 'A' | 'B';
  }[];
}

export type Screen = 'landing' | 'playing' | 'result';
