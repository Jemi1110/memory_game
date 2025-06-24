import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Player {
  name: string;
  score: number;
}

interface GameOverModalProps {
  players: Player[];
  winner: Player | null;
  isTie: boolean;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  players,
  winner,
  isTie,
  onRestart,
}) => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">¡Juego Terminado!</h1>
        
        <div className="mb-8">
          {isTie ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-yellow-600 mb-2">¡Empate!</h2>
              <p className="text-lg">Ambos jugadores obtuvieron {players[0].score} puntos</p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                ¡{winner?.name} Gana!
              </h2>
              <p className="text-lg">Puntuación: {winner?.score} puntos</p>
              <p className="text-sm text-gray-500 mt-1">¡Primero en llegar a 500 puntos!</p>
            </div>
          )}
          
          <div className="space-y-4 mt-6">
            {players.map((player, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  winner && winner.name === player.name && !isTie
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50'
                }`}
              >
                <h3 className="font-semibold">{player.name}</h3>
                <p className="text-lg font-bold">{player.score} puntos</p>
                {winner && winner.name === player.name && !isTie && (
                  <p className="text-sm text-green-600 mt-1">¡Ganador!</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={onRestart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Jugar de nuevo
          </button>
          <button 
            onClick={handleGoHome}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};
