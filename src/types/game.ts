export interface Card {
  id: number;
  type: string;
  value: string;
  img: string;
  matched: boolean;
}

export interface Player {
  name: string;
  score: number;
  correctStreak: number;
  lastAnswerWasCorrect: boolean;
}

export type CardDeckType = 'colors' | 'letters';

export interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  currentPlayerIndex: number;
  timeLeft: number;
  selectedCard: CardDeckType | null;
  hasAnswered: boolean;
  waitingForCard: boolean;
  players: Player[];
}

export type GameAction =
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'SET_GAME_OVER'; payload: boolean }
  | { type: 'NEXT_TURN' }
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'SELECT_CARD'; payload: CardDeckType | null }
  | { type: 'SET_HAS_ANSWERED'; payload: boolean }
  | { type: 'SET_WAITING_FOR_CARD'; payload: boolean }
  | { 
      type: 'UPDATE_PLAYER'; 
      payload: { 
        playerIndex: number; 
        updates: Partial<Player> | ((player: Player) => Player) 
      } 
    };

export interface GamePoints {
  CORRECT_ANSWER: number;
  INCORRECT_ANSWER: number;
  TIME_PENALTY: number;
  STREAK_BONUS: {
    MIN_STREAK: number;
    BONUS_AMOUNTS: number[];
  };
  SPEED_BONUS: {
    thresholds: number[];
    amounts: number[];
  };
}

export const GAME_POINTS: GamePoints = {
  CORRECT_ANSWER: 10,
  INCORRECT_ANSWER: -15,
  TIME_PENALTY: -25,
  STREAK_BONUS: {
    MIN_STREAK: 3,
    BONUS_AMOUNTS: [25, 50, 100], // Para 3, 5, 7+ respuestas correctas seguidas
  },
  SPEED_BONUS: {
    thresholds: [1, 5, 8, 11], // Tiempos en segundos (de menor a mayor)
    amounts: [100, 75, 50, 25], // Puntos para cada rango de tiempo
  },
};

export const TURN_DURATION = 15; // segundos

export const WINNING_SCORE = 500;
export const LOSING_SCORE = -100;
