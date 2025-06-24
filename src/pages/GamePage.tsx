import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PauseIcon, PlayIcon, ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import GameBoard from '../components/GameBoard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageLayout from '../components/layout/PageLayout';
import { useGameLogic } from '../hooks/useGameLogic';

interface GameState {
  player1: string;
  player2: string;
}

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { player1, player2 } = location.state as GameState;
  
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const {
    currentPlayer,
    timeLeft,
    playersData,
    gameOver,
    togglePause,
  } = useGameLogic({ player1, player2 });
  
  const player1Data = playersData[0];
  const player2Data = playersData[1];
  const isGameOver = gameOver;
  const winner = gameOver 
    ? player1Data.score > player2Data.score 
      ? player1Data 
      : player2Data 
    : null;

  // Efecto para manejar la pausa con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handlePauseGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePauseGame = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    setShowPauseModal(newPausedState);
    togglePause();
  };

  const handleBackToMenu = () => {
    if (window.confirm('¿Estás seguro de que quieres salir? Se perderá el progreso del juego actual.')) {
      navigate('/');
    } else {
      handlePauseGame();
    }
  };

  const handleRestartGame = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
      window.location.reload();
    }
  };

  // Calcular el progreso del juego (0-100%)
  const gameProgress = Math.min(100, (Math.max(player1Data.score, player2Data.score) / 500) * 100);

  return (
    <PageLayout className="p-0">
      {/* Barra de estado superior */}
      <header className="bg-white/90 backdrop-blur-sm shadow-md sticky top-0 z-10 rounded-b-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePauseGame}
                className="text-gray-700 hover:bg-gray-100"
                aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              >
                {isPaused ? (
                  <PlayIcon className="h-5 w-5" />
                ) : (
                  <PauseIcon className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsModal(true)}
                className="text-gray-700 hover:bg-gray-100"
                aria-label="Ajustes"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Memory Game
              </h1>
              <div className="text-xs text-gray-500">
                {isPaused ? 'Juego en pausa' : `Turno de ${currentPlayer.name.split(' ')[0]}`}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs text-gray-500">Tiempo</div>
                <div className={`text-lg font-bold ${
                  timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-gray-800'
                }`}>
                  {timeLeft}s
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${gameProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Tarjetas de puntuación */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`p-4 rounded-xl transition-all ${
            currentPlayer.name === player1 && !isPaused 
              ? 'bg-blue-50 ring-2 ring-blue-500' 
              : 'bg-white/80'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Jugador 1</h2>
                <p className="text-xl font-bold text-gray-800">{player1}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-blue-600">{player1Data.score}</div>
                <div className="text-xs text-gray-500">puntos</div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl transition-all ${
            currentPlayer.name === player2 && !isPaused 
              ? 'bg-indigo-50 ring-2 ring-indigo-500' 
              : 'bg-white/80'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Jugador 2</h2>
                <p className="text-xl font-bold text-gray-800">{player2}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-indigo-600">{player2Data.score}</div>
                <div className="text-xs text-gray-500">puntos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablero de juego */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <GameBoard 
            player1={player1} 
            player2={player2}
          />
        </div>

        {/* Controles de juego */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePauseGame}
            leftIcon={isPaused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
          >
            {isPaused ? 'Reanudar' : 'Pausar'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRestartGame}
          >
            Reiniciar
          </Button>
          
          <Button
            variant="outline"
            onClick={handleBackToMenu}
            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          >
            Menú Principal
          </Button>
        </div>
      </main>

      {/* Modal de Pausa */}
      <Modal
        isOpen={showPauseModal}
        onClose={handlePauseGame}
        title="Juego en Pausa"
        maxWidth="sm"
        closeOnOverlayClick={true}
      >
        <div className="space-y-6 py-4">
          <p className="text-gray-700 text-center">
            El juego está en pausa. ¿Qué te gustaría hacer?
          </p>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handlePauseGame}
              variant="primary"
              size="lg"
              className="w-full justify-center"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Continuar Jugando
            </Button>
            
            <Button 
              onClick={handleRestartGame}
              variant="outline"
              size="lg"
              className="w-full justify-center"
            >
              Reiniciar Juego
            </Button>
            
            <Button 
              onClick={handleBackToMenu}
              variant="ghost"
              size="lg"
              className="w-full justify-center text-red-600 hover:bg-red-50"
            >
              Salir al Menú Principal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Configuración */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Ajustes del Juego"
        maxWidth="md"
      >
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Sonido</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Efectos de sonido</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Apariencia</h3>
            <div className="grid grid-cols-3 gap-3">
              {['Azul', 'Verde', 'Morado', 'Rosa', 'Ámbar', 'Cian'].map((color) => (
                <button
                  key={color}
                  className="h-16 rounded-lg border-2 border-gray-200 transition-all hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{
                    background: `linear-gradient(135deg, var(--color-${color.toLowerCase()}-500), var(--color-${color.toLowerCase()}-600))`,
                  }}
                  aria-label={`Tema ${color}`}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button 
              onClick={() => setShowSettingsModal(false)}
              variant="primary"
              className="w-full justify-center"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notificación de juego terminado */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 mb-6">
                  <span className="text-4xl">🏆</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Juego Terminado!
                </h2>
                
                <p className="text-lg text-gray-600 mb-6">
                  {!winner 
                    ? '¡Es un empate! Ambos jugadores jugaron muy bien.' 
                    : `¡${winner.name} gana con ${winner.score} puntos!`}
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleRestartGame}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    Jugar de Nuevo
                  </Button>
                  
                  <Button 
                    onClick={handleBackToMenu}
                    variant="outline"
                    size="lg"
                    className="w-full justify-center"
                  >
                    Menú Principal
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}