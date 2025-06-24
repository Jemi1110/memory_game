import { useState, useEffect, useCallback } from 'react';
import { TURN_DURATION } from '../types/game';

interface UseGameTimerProps {
  isActive: boolean;
  onTimeOut: () => void;
  onTick?: (timeLeft: number) => void;
}

export const useGameTimer = ({ isActive, onTimeOut, onTick }: UseGameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(TURN_DURATION);
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isActive || !isRunning) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        onTick?.(newTime);
        
        if (newTime <= 0) {
          onTimeOut();
          return TURN_DURATION;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, isRunning, onTimeOut, onTick]);

  return {
    timeLeft,
    setTimeLeft,
    resetTimer,
    startTimer,
    stopTimer,
    isRunning,
  };
};
