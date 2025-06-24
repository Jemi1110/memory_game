import React, { useState, useEffect } from 'react';

interface GameHeaderProps {
  currentPlayer: string;
  player1: string;
  player2: string;
  currentPlayerIndex: number;
  timeLeft: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  player1,
  player2,
  currentPlayerIndex,
  timeLeft,
}) => {
  // Estado local para la animación suave
  const [displayTime, setDisplayTime] = useState(timeLeft);
  
  // Efecto para animar el cambio de tiempo
  useEffect(() => {
    setDisplayTime(timeLeft);
  }, [timeLeft]);

  // Calcular porcentaje para la barra de progreso
  const progressPercentage = Math.max(0, Math.min(100, (displayTime / 15) * 100));
  
  // Determinar el color de la barra de progreso
  const getProgressBarColor = () => {
    if (displayTime <= 5) return 'bg-red-500';
    if (displayTime <= 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Formatear el tiempo en MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-6 px-4">
      <div className="mb-4">
        <div className="text-center text-4xl font-mono font-bold text-gray-800 mb-2">
          {formatTime(displayTime)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${getProgressBarColor()}`}
            style={{ 
              width: `${progressPercentage}%`,
              transitionProperty: 'width, background-color',
            }}
          />
        </div>
      </div>
    </div>
  );
};
