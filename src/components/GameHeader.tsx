import React from 'react';

interface GameHeaderProps {
  currentPlayer: string;
  player1: string;
  player2: string;
  currentPlayerIndex: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentPlayer,
  player1,
  player2,
  currentPlayerIndex,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-center mb-4">Memory Game</h1>
      
      <div className="mb-6 text-center">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          Turno de: <span className="font-bold">{currentPlayer}</span>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Jugador 1: {player1} - Jugador 2: {player2}</p>
        <p className="mt-1">Turno {currentPlayerIndex + 1} de 2</p>
      </div>
    </div>
  );
};
