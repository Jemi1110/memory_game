import { useState, useEffect, useCallback, useRef } from 'react';
import { TURN_DURATION } from '../types/game';

interface UseGameTimerProps {
  isActive: boolean;
  onTimeOut: () => void;
  onTick?: (timeLeft: number) => void;
}

export function useGameTimer({ isActive, onTimeOut, onTick }: UseGameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const onTimeOutRef = useRef(onTimeOut);
  const onTickRef = useRef(onTick);

  // Actualizar las referencias de los callbacks cuando cambian
  useEffect(() => {
    onTimeOutRef.current = onTimeOut;
    onTickRef.current = onTick;
  }, [onTimeOut, onTick]);

  // Resetear el temporizador
  const reset = useCallback(() => {
    console.log('Resetting timer to', TURN_DURATION);
    startTimeRef.current = Date.now();
    setTimeLeft(TURN_DURATION);
  }, []);

  // Efecto principal para manejar el temporizador
  useEffect(() => {
    if (!isActive) {
      // Limpiar el intervalo si el temporizador está inactivo
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Iniciar el temporizador
    startTimeRef.current = Date.now();
    
    // Función para actualizar el temporizador
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000; // Tiempo transcurrido en segundos
      const newTimeLeft = Math.max(0, TURN_DURATION - elapsed);
      
      // Actualizar el estado
      setTimeLeft(newTimeLeft);
      
      // Llamar al callback de tick si está definido
      if (onTickRef.current) {
        onTickRef.current(newTimeLeft);
      }
      
      // Si se acaba el tiempo, notificar
      if (newTimeLeft <= 0) {
        if (onTimeOutRef.current) {
          onTimeOutRef.current();
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };
    
    // Configurar el intervalo
    timerRef.current = setInterval(updateTimer, 100);
    
    // Actualizar inmediatamente
    updateTimer();
    
    // Limpiar el intervalo cuando el componente se desmonte o cambie isActive
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  return {
    timeLeft,
    reset,
  };
}
