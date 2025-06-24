import { useCallback, useEffect, useMemo } from 'react';
import { useGameState } from './useGameState';
import { useGameTimer } from './useGameTimer';
import { GAME_POINTS, WINNING_SCORE, LOSING_SCORE } from '../types/game';
import type { Player } from '../types/game';
import { cardsColors } from '../data/cardsColors';
import { cardsLetters } from '../data/cardsLetters';

export function useGameLogic(players: { player1: string; player2: string }) {
  const { state, actions } = useGameState(players.player1, players.player2);
  const currentPlayer = state.players[state.currentPlayerIndex];
  
  // Memoize card decks to prevent unnecessary re-renders
  const colorDeck = useMemo(() => cardsColors, []);
  const letterDeck = useMemo(() => cardsLetters, []);

  // Configurar el temporizador
  const handleTimeOut = useCallback(() => {
    // Cuando se acaba el tiempo, se penaliza con respuesta incorrecta
    if (state.isPlaying) {
      handleAnswer(false);
      actions.nextTurn();
    }
  }, [state.isPlaying, actions]);

  const { timeLeft } = useGameTimer({
    isActive: state.isPlaying && !state.gameOver,
    onTimeOut: handleTimeOut,
  });

  // Sincronizar el tiempo restante con el estado
  useEffect(() => {
    actions.setTimeLeft(timeLeft);
  }, [timeLeft, actions]);

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
    if (state.waitingForCard) return false;
    
    // Actualizar el estado de la respuesta
    actions.answerQuestion(isCorrect);
    
    // Calcular puntos base
    let points = isCorrect ? GAME_POINTS.CORRECT_ANSWER : GAME_POINTS.INCORRECT_ANSWER;
    
    // Calcular bonificaciones si la respuesta es correcta
    if (isCorrect) {
      const speedPoints = calculateSpeedPoints(state.timeLeft);
      points += speedPoints;
      
      // Manejar racha de respuestas correctas
      actions.updatePlayer(state.currentPlayerIndex, (player) => {
        const newStreak = player.lastAnswerWasCorrect ? player.correctStreak + 1 : 1;
        const streakBonus = player.lastAnswerWasCorrect 
          ? calculateStreakBonus(newStreak)
          : 0;
        
        return {
          ...player,
          score: player.score + points + streakBonus,
          correctStreak: newStreak,
          lastAnswerWasCorrect: true,
        };
      });
    } else {
      // Reiniciar racha por respuesta incorrecta
      actions.updatePlayer(state.currentPlayerIndex, (player) => ({
        ...player,
        score: player.score + points,
        correctStreak: 0,
        lastAnswerWasCorrect: false,
      }));
    }
    
    // Verificar condiciones de victoria/derrota
    const updatedPlayer = {
      ...state.players[state.currentPlayerIndex],
      score: state.players[state.currentPlayerIndex].score + points
    };
    
    if (updatedPlayer.score >= WINNING_SCORE || updatedPlayer.score <= LOSING_SCORE) {
      actions.setGameOver(true);
      
      if (updatedPlayer.score <= LOSING_SCORE) {
        // Almacenar estado del juego para la pantalla de GameOver
        sessionStorage.setItem('gameOverState', JSON.stringify({
          players: state.players.map((p, idx) => 
            idx === state.currentPlayerIndex ? updatedPlayer : p
          ),
          loser: updatedPlayer,
          reason: 'negative_score' as const
        }));
      }
    }
    
    return true;
  }, [
    state.waitingForCard, 
    state.timeLeft, 
    state.currentPlayerIndex, 
    state.players,
    actions,
    calculateSpeedPoints, 
    calculateStreakBonus
  ]);

  // Manejar selección de carta
  const selectCard = useCallback((deckType: 'colors' | 'letters'): boolean => {
    if (!state.waitingForCard) return false;
    
    actions.selectCard(deckType);
    return true;
  }, [state.waitingForCard, actions]);

  // Devolver el estado y las acciones del juego
  return {
    // Estado
    currentPlayer,
    currentPlayerIndex: state.currentPlayerIndex,
    timeLeft: state.timeLeft,
    isPlaying: state.isPlaying,
    playersData: state.players,
    selectedCard: state.selectedCard,
    hasAnswered: state.hasAnswered,
    waitingForCard: state.waitingForCard,
    gameOver: state.gameOver,
    colorDeck,
    letterDeck,
    
    // Acciones
    selectCard,
    answerQuestion: handleAnswer,
    togglePause: actions.togglePause,
    addPoints: handleAnswer, // Compatibilidad con el código existente
  } as const;
}

export type { Player };
