import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import type { Player } from '../hooks/useGameLogic';

interface GameOverState {
  players: Player[];
  loser: Player | null;
  reason: 'score_reached' | 'negative_score';
}

export default function GameOverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { players, loser, reason } = location.state as GameOverState;

  const handlePlayAgain = () => {
    navigate('/setup');
  };

  const handleNewGame = () => {
    navigate('/setup');
  };

  return (
    <PageLayout className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <motion.div 
        className="max-w-4xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {reason === 'negative_score' ? '¡Juego Terminado!' : '¡Fin del Juego!'}
          </motion.h1>
          
          {reason === 'negative_score' && loser ? (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xl mb-6">
                <span className="font-bold text-red-300">{loser.name}</span> ha alcanzado -100 puntos.
              </p>
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6 max-w-lg mx-auto">
                <p className="text-red-100">¡El juego ha terminado porque un jugador ha alcanzado -100 puntos!</p>
              </div>
            </motion.div>
          ) : (
            <motion.p 
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ¡El juego ha terminado!
            </motion.p>
          )}
        </div>

        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {players.map((player, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-2xl backdrop-blur-sm ${
                reason === 'negative_score' && player.name === loser?.name 
                  ? 'bg-red-900/30 border-2 border-red-500/80 shadow-lg shadow-red-500/20'
                  : 'bg-white/5 border border-white/10 shadow-lg'
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.6 + (index * 0.1),
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-100">{player.name}</h3>
                {reason === 'negative_score' && player.name === loser?.name && (
                  <span className="bg-red-500/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Perdedor
                  </span>
                )}
              </div>
              <div className="text-4xl font-bold mt-2 text-white">
                {player.score} <span className="text-base text-gray-300">puntos</span>
              </div>
              {player.score < 0 && (
                <div className="mt-3 text-sm font-medium px-3 py-1.5 rounded-full inline-block bg-red-900/30 text-red-200">
                  {player.score < -50 ? '¡Puntuación muy baja!' : 'Puntuación negativa'}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={handlePlayAgain}
            size="lg"
            variant="primary"
            className="px-8 py-3 text-base font-medium"
          >
            Jugar Otra Vez
          </Button>
          <Button
            onClick={handleNewGame}
            variant="secondary"
            className="px-8 py-3 text-base font-medium"
          >
            Menú Principal
          </Button>
        </motion.div>

        <motion.div 
          className="mt-10 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>¿Quieres mejorar tu puntuación? ¡Intenta ser más rápido en tus respuestas!</p>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}