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
    if (state.gameOver) {
      console.log('Game is over, cannot proceed to next turn');
      return false;
    }
    
    console.log('Proceeding to next turn');
    dispatch({ type: 'NEXT_TURN' });
    return true;
  }, [state.gameOver]);

  const selectCard = useCallback((deckType: 'colors' | 'letters' | null) => {
    // Get fresh state values
    const { waitingForCard, gameOver, currentPlayerIndex } = state;
    
    console.log('useGameState selectCard called with:', { 
      deckType, 
      waitingForCard,
      gameOver,
      currentPlayerIndex,
      players: state.players.map(p => p.name)
    });
    
    // Solo permitir seleccionar carta si estamos esperando una carta
    if (!waitingForCard) {
      console.log('Not waiting for card selection');
      return false;
    }
    
    if (deckType === null) {
      console.log('Invalid deck type');
      return false;
    }
    
    console.log('Dispatching SELECT_CARD with:', deckType);
    
    try {
      // Actualizar el estado con la carta seleccionada
      dispatch({ type: 'SELECT_CARD', payload: deckType });
      
      // Marcar que ya no estamos esperando por una carta
      dispatch({ type: 'SET_WAITING_FOR_CARD', payload: false });
      
      console.log('Card selected successfully');
      
      // Cambiar al siguiente turno después de un breve retraso
      // para permitir que se complete la animación
      setTimeout(() => {
        console.log('Moving to next turn after card selection');
        // Llamamos a nextTurn solo si no se ha terminado el juego
        if (!gameOver) {
          nextTurn();
        } else {
          console.log('Game is over, not moving to next turn');
        }
      }, 300); // Reducido el tiempo de espera para una mejor experiencia de usuario
      
      return true;
    } catch (error) {
      console.error('Error in selectCard:', error);
      dispatch({ type: 'SET_WAITING_FOR_CARD', payload: false });
      return false;
    }
  }, [state, nextTurn]);

  const answerQuestion = useCallback((isCorrect: boolean) => {
    // Get fresh state values
    const { hasAnswered } = state;
    
    console.log('answerQuestion called with:', { 
      isCorrect, 
      hasAnswered, 
      waitingForCard: state.waitingForCard 
    });
    
    // Si ya respondió, no hacer nada
    if (hasAnswered) {
      console.log('Question already answered');
      return false;
    }
    
    console.log('Marking question as answered and waiting for card selection');
    
    // Marcamos que ya respondió y que estamos esperando la selección de carta
    dispatch({ type: 'SET_HAS_ANSWERED', payload: true });
    dispatch({ type: 'SET_WAITING_FOR_CARD', payload: true });
    
    return true;
  }, [state]);

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
