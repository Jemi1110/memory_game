import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useContext } from 'react';
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';
import { AudioContext } from '../utils/audio';
import Button from '../components/ui/Button';
import PageLayout from '../components/layout/PageLayout';
import type { Player } from '../hooks/useGameLogic';

// Animation variants
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const winnerVariants: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      delay: 0.3
    }
  },
  hover: { 
    scale: 1.03,
    transition: { 
      type: 'spring', 
      stiffness: 300,
      damping: 10
    } 
  }
};

interface GameOverState {
  players: Player[];
  winner: Player | null;
  loser: Player | null;
  reason: 'score_reached' | 'negative_score';
  timestamp: number;
  from: string;
}

export default function GameOverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as GameOverState | null;
  const { playSound } = useContext(AudioContext);
  const [gameState, setGameState] = useState<GameOverState | null>(null);
  
  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }

    // Check if we came from the game page
    if (state.from !== 'game') {
      navigate('/');
      return;
    }

    // Play appropriate sound based on game result
    if (state.winner) {
      playSound('victory');
    } else if (state.loser) {
      playSound('timeout');
    }

    setGameState(state);
  }, [state, navigate, playSound]);
  
  // If no game state is available yet, show loading
  if (!gameState) {
    return (
      <PageLayout className="bg-gradient-to-br from-gray-900 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Cargando resultados del juego...</p>
        </div>
      </PageLayout>
    );
  }
  
  const { players, winner, loser, reason } = gameState;
  
  // Determinar el ganador si no se proporcionó
  const actualWinner = winner || (players[0]?.score > players[1]?.score ? players[0] : players[1]);
  const isTie = players[0]?.score === players[1]?.score;

  const handlePlayAgain = () => {
    // Clear any game state and go to setup
    navigate('/setup', { replace: true });
  };

  const handleNewGame = () => {
    // Clear any game state and go to home
    navigate('/', { replace: true });
  };

  return (
    <PageLayout className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      <motion.div 
        className="relative max-w-5xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        data-testid="game-over-container"
      >
        {/* Game Over Header */}
        <motion.div 
          className="text-center mb-12" 
          variants={itemVariants}
          data-testid="game-over-header"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500"
            variants={itemVariants}
          >
            {reason === 'negative_score' ? '¡Juego Terminado!' : '¡Fin del Juego!'}
          </motion.h1>
          
          <motion.div className="mt-6 space-y-6" variants={itemVariants}>
            <AnimatePresence mode="wait">
              {reason === 'negative_score' && loser ? (
                <motion.div 
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm max-w-2xl mx-auto"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                >
                  <p className="text-lg text-gray-800">
                    <span className="font-bold text-amber-700">{loser.name}</span> ha alcanzado -100 puntos.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    El juego ha terminado porque se alcanzó el límite de puntuación.
                  </p>
                </motion.div>
              ) : isTie ? (
                <motion.div 
                  className="space-y-2"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-400">
                    ¡Es un empate!
                  </p>
                  <p className="text-gray-600">Ambos jugadores han terminado con {players[0]?.score} puntos.</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-4"
                  variants={winnerVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <p className="text-xl font-medium text-gray-600">¡Tenemos un ganador!</p>
                  <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 p-1 rounded-full shadow-lg">
                    <div className="bg-white px-8 py-4 rounded-full">
                      <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                        {actualWinner?.name}
                      </p>
                      <p className="text-lg text-gray-600 mt-2">
                        con <span className="font-bold text-gray-800">{actualWinner?.score}</span> puntos
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Player Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {players.map((player, index) => {
            const isLoser = reason === 'negative_score' && player.name === loser?.name;
            const isWinner = !isTie && player.name === actualWinner?.name;
            
            return (
              <motion.div
                key={index}
                className={`relative p-6 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                  isLoser 
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 shadow-lg' 
                    : isWinner
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 shadow-lg'
                    : 'bg-white border border-gray-100 shadow-md'
                }`}
                variants={itemVariants}
                custom={index}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Decorative elements */}
                {isWinner && (
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-yellow-400/10 rounded-full"></div>
                )}
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        isLoser ? 'text-gray-800' : 'text-gray-800'
                      }`}>
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isLoser ? 'Segundo lugar' : isWinner ? 'Ganador' : 'Jugador'}
                      </p>
                    </div>
                    
                    <div className={`text-4xl font-bold ${
                      isLoser ? 'text-gray-700' : isWinner ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {player.score}
                      <span className="text-base font-normal text-gray-500 ml-1">puntos</span>
                    </div>
                  </div>
                  
                  {/* Score bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round((player.score / 500) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${
                          isLoser ? 'bg-amber-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(100, Math.max(0, (player.score / 500) * 100))}%` 
                        }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      />
                    </div>
                  </div>
                  
                  {player.score < 0 && (
                    <motion.div 
                      className="mt-4 text-sm font-medium px-4 py-2 rounded-lg inline-block bg-amber-50 text-amber-700 border border-amber-200"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      {player.score < -50 ? '¡Puntuación baja!' : 'Puntuación por debajo de cero'}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-16 space-y-6 text-center"
          variants={containerVariants}
        >
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={itemVariants}
          >
            <Button
              onClick={handlePlayAgain}
              size="lg"
              variant="success"
              className="px-10 py-4 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              leftIcon={<ArrowPathIcon className="w-5 h-5" />}
            >
              Jugar Otra Vez
            </Button>
            <Button
              onClick={handleNewGame}
              variant="outline"
              className="px-10 py-4 text-base font-medium"
              leftIcon={<HomeIcon className="w-5 h-5" />}
            >
              Menú Principal
            </Button>
          </motion.div>
          
          <motion.p 
            className="text-gray-500 text-sm mt-8 max-w-md mx-auto leading-relaxed"
            variants={itemVariants}
          >
            ¿Quieres mejorar tu puntuación? Intenta ser más rápido en tus respuestas y mantén una racha de aciertos para ganar bonificaciones.
          </motion.p>
          
          <motion.div 
            className="mt-8 pt-6 border-t border-gray-100"
            variants={itemVariants}
          >
            <p className="text-xs text-gray-400">
              Juego desarrollado con ❤️ © {new Date().getFullYear()}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}