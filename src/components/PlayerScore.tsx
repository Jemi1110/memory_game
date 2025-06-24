import React from 'react';

interface PlayerScoreProps {
  player: {
    name: string;
    score: number;
  };
  isCurrentPlayer: boolean;
}

export const PlayerScore: React.FC<PlayerScoreProps> = ({ player, isCurrentPlayer }) => {
  const progress = Math.min(100, (player.score / 500) * 100);
  
  return (
    <div 
      className={`p-4 rounded-lg transition-all ${
        isCurrentPlayer 
          ? 'bg-blue-100 border-2 border-blue-500 scale-105' 
          : 'bg-gray-100 opacity-90'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">{player.name}</div>
        <div className="text-lg font-bold">{player.score} / 500</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {isCurrentPlayer && (
        <div className="text-xs text-blue-600 mt-1 font-medium">
          ¡Es tu turno!
        </div>
      )}
    </div>
  );
};
