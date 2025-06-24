import { useCallback, useEffect, useMemo } from 'react';
import { useGameState } from './useGameState';
import { useGameTimer } from './useGameTimer';
import { GAME_POINTS, WINNING_SCORE, LOSING_SCORE } from '../types/game';
import type { Player } from '../types/game';
import { cardsColors } from '../data/cardsColors';
import { cardsLetters } from '../data/cardsLetters';

interface UseGameLogicProps {
  player1: string;
  player2: string;
  onGameOver?: (players: Player[], loser: Player | null, reason: 'score_reached' | 'negative_score') => void;
}

export function useGameLogic({ player1, player2, onGameOver }: UseGameLogicProps) {
  const { state, actions } = useGameState(player1, player2);
  const currentPlayer = state.players[state.currentPlayerIndex];

  // Memoize card decks to prevent unnecessary re-renders
  const colorDeck = useMemo(() => cardsColors, []);
  const letterDeck = useMemo(() => cardsLetters, []);

  // Calcular puntos por velocidad de respuesta
  const calculateSpeedPoints = useCallback((timeLeft: number): number => {
    if (timeLeft === 0) return GAME_POINTS.TIME_PENALTY;
    
    const { thresholds, amounts } = GAME_POINTS.SPEED_BONUS;
    const index = thresholds.findIndex(threshold => timeLeft >= threshold);
    return index >= 0 ? amounts[index] : 0;
  }, []);

  // Calcular bonificación por racha de respuestas correctas
  const calculateStreakBonus = useCallback((streak: number): number => {
    const { MIN_STREAK, BONUS_AMOUNTS } = GAME_POINTS.STREAK_BONUS;
    
    if (streak < MIN_STREAK) return 0;
    
    // Obtener el bono según la longitud de la racha
    const bonusIndex = Math.min(
      Math.floor((streak - MIN_STREAK) / 2), 
      BONUS_AMOUNTS.length - 1
    );
    
    return BONUS_AMOUNTS[bonusIndex];
  }, []);

  // Manejar la respuesta del jugador
  const handleAnswer = useCallback((isCorrect: boolean): boolean => {
    if (state.waitingForCard) {
      console.log('Already waiting for card, ignoring answer');
      return false;
    }
    
    console.log('Processing answer:', { isCorrect, timeLeft: state.timeLeft });
    
    // Detener el temporizador inmediatamente al responder
    stop();
    
    // Calcular puntos base
    let points = isCorrect ? GAME_POINTS.CORRECT_ANSWER : GAME_POINTS.INCORRECT_ANSWER;
    let speedPoints = 0;
    let streakBonus = 0;
    
    // Calcular bonificaciones si la respuesta es correcta
    if (isCorrect) {
      speedPoints = calculateSpeedPoints(state.timeLeft);
      points += speedPoints;
      console.log('Speed points:', speedPoints, 'Total points:', points);
    }
    
    // Actualizar el estado del jugador
    actions.updatePlayer(state.currentPlayerIndex, (player: Player) => {
      // Calcular bonificación por racha solo si la respuesta es correcta
      if (isCorrect) {
        const newStreak = player.lastAnswerWasCorrect ? player.correctStreak + 1 : 1;
        streakBonus = player.lastAnswerWasCorrect ? calculateStreakBonus(newStreak) : 0;
        
        console.log('Player stats - Streak:', newStreak, 'Bonus:', streakBonus);
        
        return {
          ...player,
          score: player.score + points + streakBonus,
          correctStreak: newStreak,
          lastAnswerWasCorrect: true,
        };
      } else {
        // Reiniciar racha por respuesta incorrecta
        return {
          ...player,
          score: Math.max(player.score + points, LOSING_SCORE), // No permitir puntuación menor al mínimo
          correctStreak: 0,
          lastAnswerWasCorrect: false,
        };
      }
    });
    
    // Marcar que ya se respondió y esperar por la selección de carta
    console.log('Marking question as answered, waiting for card selection');
    actions.answerQuestion(isCorrect);
    
    return true;
  }, [
    state.waitingForCard, 
    state.timeLeft, 
    state.currentPlayerIndex, 
    actions, 
    calculateSpeedPoints, 
    calculateStreakBonus
  ]);

  // Manejador de tiempo agotado
  const handleTimeOut = useCallback(() => {
    console.log('Time out! Handling timeout...');
    if (state.isPlaying && !state.gameOver) {
      console.log('Processing timeout for player:', currentPlayer.name);
      const answerProcessed = handleAnswer(false);
      
      if (answerProcessed) {
        setTimeout(() => {
          actions.nextTurn();
        }, 500);
      }
    }
  }, [state.isPlaying, state.gameOver, currentPlayer, handleAnswer, actions.nextTurn]);

  // Manejador de tick del temporizador
  const handleTick = useCallback((newTime: number) => {
    if (state.isPlaying && !state.gameOver) {
      actions.setTimeLeft(Math.floor(newTime));
    }
  }, [state.isPlaying, state.gameOver, actions.setTimeLeft]);

  // Inicializar el temporizador
  const { timeLeft, reset: resetTimer } = useGameTimer({
    isActive: state.isPlaying && !state.gameOver && !state.waitingForCard,
    onTimeOut: handleTimeOut,
    onTick: handleTick
  });
  
  // Efecto para reiniciar el temporizador cuando cambia el turno
  useEffect(() => {
    if (state.isPlaying && !state.gameOver && state.waitingForCard) {
      console.log('Resetting timer due to turn change');
      resetTimer();
    }
  }, [state.currentPlayerIndex, state.isPlaying, state.gameOver, state.waitingForCard, resetTimer]);

  // Check for win/lose conditions after state updates
  useEffect(() => {
    const checkGameOver = () => {
      // Skip if game is already over or players aren't initialized
      if (state.gameOver || !state.players[state.currentPlayerIndex]) return;
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const otherPlayer = state.players[(state.currentPlayerIndex + 1) % 2];
      
      // Check if current player has won or lost
      const hasWon = currentPlayer.score >= WINNING_SCORE;
      const hasLost = currentPlayer.score <= LOSING_SCORE;
      const isGameOver = hasWon || hasLost;
      
      if (isGameOver) {
        // Mark game as over first to prevent further actions
        actions.setGameOver(true);
        
        // Determine winner/loser and reason
        const winner = hasWon ? currentPlayer : 
                             (otherPlayer.score > currentPlayer.score ? otherPlayer : null);
        const loser = hasLost ? currentPlayer : 
                              (otherPlayer.score < currentPlayer.score ? otherPlayer : null);
        const reason = hasWon ? 'score_reached' as const : 'negative_score' as const;
        
        console.log('Game over condition detected:', { 
          currentPlayer: currentPlayer.name,
          currentScore: currentPlayer.score,
          otherPlayer: otherPlayer.name,
          otherScore: otherPlayer.score,
          WINNING_SCORE,
          LOSING_SCORE,
          reason
        });
        
        // Trigger game over callback if provided
        if (onGameOver) {
          console.log('Calling onGameOver callback with players:', 
            state.players.map(p => `${p.name}: ${p.score}`));
          onGameOver(state.players, loser, reason);
        }
      }
    };
    
    // Only check for game over if the game is active
    if (state.isPlaying) {
      checkGameOver();
    }
  }, [state.players, state.currentPlayerIndex, actions, onGameOver]);

  // Manejar selección de carta
  const selectCard = useCallback((deckType: 'colors' | 'letters'): boolean => {
    console.log('useLogic selectCard called with:', { 
      deckType, 
      waitingForCard: state.waitingForCard,
      hasAnswered: state.hasAnswered
    });
    
    if (!state.waitingForCard) {
      console.log('Not waiting for card in useLogic');
      return false;
    }
    
    const result = actions.selectCard(deckType);
    console.log('actions.selectCard result:', result);
    return result;
  }, [state.waitingForCard, state.hasAnswered, actions]);

  // Definir el tipo de retorno
  const gameLogic = {
    // Estado
    state,
    currentPlayer,
    timeLeft: state.timeLeft,
    playersData: state.players,
    gameOver: state.gameOver,
    waitingForCard: state.waitingForCard,
    colorDeck,
    letterDeck,
    
    // Acciones
    togglePause: actions.togglePause,
    nextTurn: actions.nextTurn,
    selectCard,
    answerQuestion: handleAnswer,
  };

  return gameLogic;
}

export type { Player };
