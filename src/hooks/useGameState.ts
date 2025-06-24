import { useReducer, useCallback } from 'react';
import { TURN_DURATION } from '../types/game';
import type { GameState, GameAction, Player } from '../types/game';

const initialState: GameState = {
  isPlaying: true,
  gameOver: false,
  currentPlayerIndex: 0,
  timeLeft: TURN_DURATION,
  selectedCard: null,
  hasAnswered: false,
  waitingForCard: false,
  players: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TOGGLE_PAUSE':
      return { ...state, isPlaying: !state.isPlaying };
      
    case 'SET_GAME_OVER':
      return { 
        ...state, 
        gameOver: action.payload,
        isPlaying: false 
      };
      
    case 'NEXT_TURN':
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        timeLeft: TURN_DURATION,
        selectedCard: null,
        hasAnswered: false,
        waitingForCard: false,
      };
      
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
      
    case 'SELECT_CARD':
      return { ...state, selectedCard: action.payload };
      
    case 'SET_HAS_ANSWERED':
      return { ...state, hasAnswered: action.payload };
      
    case 'SET_WAITING_FOR_CARD':
      return { ...state, waitingForCard: action.payload };
      
    case 'UPDATE_PLAYER': {
      const { playerIndex, updates } = action.payload;
      const updatedPlayers = [...state.players];
      const player = updatedPlayers[playerIndex];
      
      updatedPlayers[playerIndex] = typeof updates === 'function' 
        ? updates(player)
        : { ...player, ...updates };
        
      return { ...state, players: updatedPlayers };
    }
    
    default:
      return state;
  }
}

export const useGameState = (player1Name: string, player2Name: string) => {
  const [state, dispatch] = useReducer(
    gameReducer, 
    {
      ...initialState,
      players: [
        createPlayer(player1Name),
        createPlayer(player2Name),
      ],
    }
  );

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const setGameOver = useCallback((gameOver: boolean) => {
    dispatch({ type: 'SET_GAME_OVER', payload: gameOver });
  }, []);

  const nextTurn = useCallback(() => {
    if (state.gameOver) return false;
    dispatch({ type: 'NEXT_TURN' });
    return true;
  }, [state.gameOver]);

  const selectCard = useCallback((deckType: 'colors' | 'letters' | null) => {
    if (!state.waitingForCard && deckType !== null) return false;
    
    dispatch({ type: 'SELECT_CARD', payload: deckType });
    dispatch({ type: 'SET_WAITING_FOR_CARD', payload: false });
    
    if (deckType !== null) {
      nextTurn();
    }
    
    return true;
  }, [nextTurn, state.waitingForCard]);

  const answerQuestion = useCallback((_isCorrect: boolean) => {
    if (state.waitingForCard) return false;
    
    dispatch({ type: 'SET_HAS_ANSWERED', payload: true });
    dispatch({ type: 'SET_WAITING_FOR_CARD', payload: true });
    
    return true;
  }, [state.waitingForCard]);

  const updatePlayer = useCallback((playerIndex: number, updates: Partial<Player> | ((player: Player) => Player)) => {
    dispatch({ 
      type: 'UPDATE_PLAYER', 
      payload: { playerIndex, updates } 
    });
  }, []);

  return {
    state,
    actions: {
      togglePause,
      setGameOver,
      nextTurn,
      selectCard,
      answerQuestion,
      updatePlayer,
      setTimeLeft: (time: number) => dispatch({ type: 'SET_TIME_LEFT', payload: time }),
    },
  };
};

function createPlayer(name: string): Player {
  return {
    name,
    score: 0,
    correctStreak: 0,
    lastAnswerWasCorrect: false,
  };
}
