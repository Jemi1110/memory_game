import React from 'react';

interface GameControlsProps {
  timeLeft: number;
  waitingForCard: boolean;
  onAnswer: (isCorrect: boolean) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  timeLeft,
  waitingForCard,
  onAnswer,
}) => {
  return (
    <div className="w-full">
      <div className="bg-white/90 backdrop-blur-sm shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-700">Tiempo:</div>
            <div className={`text-lg font-bold ${
              timeLeft <= 5 ? 'text-red-600' : 'text-gray-800'
            }`}>
              {timeLeft}s
            </div>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-500 text-center">
            {waitingForCard ? 'Selecciona una baraja' : 'Responde rápido para ganar más puntos'}
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-4 sm:gap-6">
          <button 
            onClick={() => onAnswer(true)}
            disabled={waitingForCard}
            className={`flex-1 flex flex-col items-center justify-center py-4 sm:py-5 rounded-xl ${
              !waitingForCard
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gray-200 cursor-not-allowed'
            } text-white transition-all transform hover:scale-[1.02] active:scale-100`}
          >
            <span className="text-3xl sm:text-4xl mb-1">✓</span>
            <span className="text-sm sm:text-base font-semibold">CORRECTO</span>
            <span className="text-xs opacity-90 mt-0.5">+10 pts</span>
          </button>
          
          <button 
            onClick={() => onAnswer(false)}
            disabled={waitingForCard}
            className={`flex-1 flex flex-col items-center justify-center py-4 sm:py-5 rounded-xl ${
              !waitingForCard
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-200 cursor-not-allowed'
            } text-white transition-all transform hover:scale-[1.02] active:scale-100`}
          >
            <span className="text-3xl sm:text-4xl mb-1">✗</span>
            <span className="text-sm sm:text-base font-semibold">INCORRECTO</span>
            <span className="text-xs opacity-90 mt-0.5">-5 pts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
