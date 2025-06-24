import React from 'react';
import type { Player } from '../types/game';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  position: number;
  maxScore: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  player,
  isCurrentPlayer,
  position,
  maxScore
}) => {
  const progress = maxScore > 0 ? (player.score / maxScore) * 100 : 0;
  const positionColors = [
    'from-yellow-400 to-yellow-500', // 1er lugar
    'from-gray-300 to-gray-400',     // 2do lugar
    'from-amber-600 to-amber-700',   // 3er lugar
    'from-gray-100 to-gray-200',     // otros
  ];

  const positionText = [
    '1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°'
  ];

  return (
    <motion.div 
      className={`relative p-4 rounded-xl overflow-hidden transition-all duration-300 ${
        isCurrentPlayer 
          ? 'ring-2 ring-primary-500 ring-offset-2 scale-[1.02]' 
          : 'bg-white/80'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: position * 0.1 }}
    >
      {/* Fondo de posición */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${
        positionColors[Math.min(position, positionColors.length - 1)]
      } text-white flex items-center justify-center text-2xl font-bold rounded-bl-xl`}>
        {positionText[position] || `${position + 1}°`}
      </div>

      {/* Contenido */}
      <div className="pr-16">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`text-lg font-bold ${
            isCurrentPlayer ? 'text-primary-700' : 'text-gray-800'
          }`}>
            {player.name}
          </h3>
          <span className="text-xl font-bold text-gray-900">
            {player.score} pts
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Estadísticas */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Racha: {player.correctStreak} 🔥</span>
          <span>Última: {player.lastAnswerWasCorrect ? '✅' : '❌'}</span>
        </div>
      </div>

      {/* Efecto de resplandor para el jugador actual */}
      {isCurrentPlayer && (
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
        />
      )}
    </motion.div>
  );
};

export default ScoreCard;
