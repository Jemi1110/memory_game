import React from 'react';

interface GameControlsProps {
  timeLeft: number;
  isPlaying: boolean;
  waitingForCard: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onTogglePause: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  timeLeft,
  isPlaying,
  waitingForCard,
  onAnswer,
  onTogglePause,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-lg font-semibold">
        Tiempo: <span className={timeLeft <= 5 ? 'text-red-500' : 'text-green-600'}>{timeLeft}s</span>
      </div>
      
      <div className="flex justify-center items-center gap-8 my-6">
        <button 
          onClick={() => onAnswer(true)}
          disabled={waitingForCard}
          className={`flex flex-col items-center justify-center w-24 h-24 rounded-full ${
            !waitingForCard
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-300 cursor-not-allowed'
          } text-white transition-all transform hover:scale-105`}
        >
          <span className="text-4xl">✓</span>
          <span className="text-sm mt-1">CORRECTO</span>
          <span className="text-xs opacity-80">+10 pts</span>
        </button>
        
        <button 
          onClick={() => onAnswer(false)}
          disabled={waitingForCard}
          className={`flex flex-col items-center justify-center w-24 h-24 rounded-full ${
            !waitingForCard
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gray-300 cursor-not-allowed'
          } text-white transition-all transform hover:scale-105`}
        >
          <span className="text-4xl">✗</span>
          <span className="text-sm mt-1">INCORRECTO</span>
          <span className="text-xs opacity-80">-5 pts</span>
        </button>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={onTogglePause}
          className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors text-sm"
        >
          {isPlaying ? '⏸ Pausar' : '▶ Reanudar'}
        </button>
      </div>
    </div>
  );
};
