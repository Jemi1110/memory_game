import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useCallback, useEffect, useContext } from 'react';
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline';
import { AudioContext } from '../utils/audio';
import GameBoard from '../components/GameBoard';
import { GameHeader } from '../components/GameHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageLayout from '../components/layout/PageLayout';
import { useGameLogic } from '../hooks/useGameLogic';
import { WINNING_SCORE, LOSING_SCORE } from '../types/game';

interface GameState {
  player1: string;
  player2: string;
}

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { player1, player2 } = location.state as GameState;
  
  const [isPaused, setIsPaused] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  
  const [hasNavigatedAway, setHasNavigatedAway] = useState(false);
  
  const handleGameOver = useCallback((players: any[], loser: any, reason: 'score_reached' | 'negative_score') => {
    // Prevent multiple navigations
    if (hasNavigatedAway) {
      console.log('Already navigated away, ignoring duplicate game over');
      return;
    }
    
    // Determine winner and if it's a tie
    const winner = players[0]?.score > players[1]?.score ? players[0] : players[1];
    const isTie = players[0]?.score === players[1]?.score;
    
    console.log('Game over condition met:', { 
      players: players.map(p => ({ name: p.name, score: p.score })),
      winner: isTie ? 'Tie' : winner?.name,
      loser: loser?.name,
      reason,
      WINNING_SCORE,
      LOSING_SCORE
    });
    
    // Mark navigation as in progress
    setHasNavigatedAway(true);
    
    // Prepare navigation state
    const navigationState = { 
      players,
      winner: isTie ? null : winner,
      loser,
      reason,
      timestamp: Date.now(),
      from: 'game' // Asegurar que vengamos de la página de juego
    };
    
    console.log('Navigating to game over page with state:', navigationState);
    
    // Navigate immediately without setTimeout
    navigate('/game-over', { 
      state: navigationState,
      replace: true // Replace current history entry
    });
  }, [navigate, hasNavigatedAway]);

  const { playSound } = useContext(AudioContext);
  
  useEffect(() => {
    playSound('turnStart');
  }, [playSound]);

  const { 
    state,
    currentPlayer,
    timeLeft,
    togglePause,
    answerQuestion,
    waitingForCard,
    selectCard
  } = useGameLogic({ 
    player1, 
    player2,
    onGameOver: (players, loser, reason) => {
      if (reason === 'score_reached') {
        playSound('victory');
      } else if (reason === 'negative_score') {
        playSound('timeout');
      }
      handleGameOver(players, loser, reason);
    }
  });
  
  const playersData = state.players;
  const player1Data = playersData[0];
  const player2Data = playersData[1];
  
  const handleAnswer = (isCorrect: boolean) => {
    console.log('handleAnswer called with:', { isCorrect, waitingForCard, currentPlayer });
    
    // Only allow answering if we're not waiting for a card
    if (waitingForCard) {
      console.log('Already waiting for card selection');
      return;
    }
    
    // Play appropriate sound based on answer
    playSound(isCorrect ? 'correct' : 'incorrect');
    
    console.log('Processing answer, will wait for card selection');
    answerQuestion(isCorrect);
  };

  // El manejo de gameOver ahora se hace directamente en el callback onGameOver de useGameLogic

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

  const handlePauseGame = useCallback(() => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    togglePause();
  }, [isPaused, togglePause]);

  const handleBackToMenu = useCallback(() => {
    setShowMenuModal(true);
  }, []);

  const confirmBackToMenu = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleRestartGame = useCallback(() => {
    setShowRestartModal(true);
  }, []);

  const confirmRestartGame = useCallback(() => {
    window.location.reload();
  }, []);

  // Calcular el progreso del juego (0-100%)
  const gameProgress = Math.min(100, (Math.max(player1Data.score, player2Data.score) / 500) * 100);

  return (
    <PageLayout className="min-h-screen w-full flex flex-col bg-gray-50 overflow-x-hidden">
      {/* Header with Timer and Progress Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <GameHeader 
          currentPlayer={currentPlayer?.name || ''}
          player1={player1}
          player2={player2}
          currentPlayerIndex={state?.currentPlayerIndex || 0}
          timeLeft={timeLeft}
        />
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 w-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: '0%' }}
            animate={{ width: `${gameProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <main className="flex-1 w-full overflow-auto py-4">
        <div className="w-full px-4 sm:px-8">
          <div className="flex flex-col space-y-6 w-full">
            {/* Player Turns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div className={`relative p-4 rounded-2xl transition-all transform hover:scale-[1.02] ${
              currentPlayer.name === player1 && !isPaused 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 shadow-lg' 
                : 'bg-white border-2 border-gray-100 shadow-md hover:shadow-lg'
            }`}>
              <div className="absolute top-4 right-4">
                {currentPlayer.name === player1 && !isPaused && (
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-ping"></div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-blue-600 mb-1">Jugador 1</h2>
                  <p className="text-2xl font-bold text-gray-800">{player1}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-blue-600">{player1Data.score}</div>
                  <div className="text-sm font-medium text-blue-500 bg-blue-50 px-3 py-1 rounded-full inline-block">Puntos</div>
                </div>
              </div>
            </div>

            <div className={`relative p-4 rounded-2xl transition-all transform hover:scale-[1.02] ${
              currentPlayer.name === player2 && !isPaused 
                ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-400 shadow-lg' 
                : 'bg-white border-2 border-gray-100 shadow-md hover:shadow-lg'
            }`}>
              <div className="absolute top-4 right-4">
                {currentPlayer.name === player2 && !isPaused && (
                  <div className="h-3 w-3 bg-indigo-500 rounded-full animate-ping"></div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-indigo-600 mb-1">Jugador 2</h2>
                  <p className="text-2xl font-bold text-gray-800">{player2}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-indigo-600">{player2Data.score}</div>
                  <div className="text-sm font-medium text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full inline-block">Puntos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Board and Controls Row */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Game Board */}
            <div className="flex-1 min-w-0 w-full">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 w-full h-full min-h-[500px] overflow-hidden shadow-lg max-w-none">
                <GameBoard 
                  player1={player1} 
                  player2={player2}
                  waitingForCard={waitingForCard}
                  onSelectCard={selectCard}
                />
              </div>
            </div>
            
            {/* Side Controls */}
            <div className="flex flex-col w-64 gap-3 flex-shrink-0">
              {/* Botones de respuesta */}
              <div className="space-y-3 mb-4">
                <h3 className="text-lg font-medium text-gray-700 text-center">
                  {waitingForCard ? 'Selecciona una carta' : '¿Es correcto?'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={waitingForCard}
                    className={`flex items-center justify-center py-4 px-4 rounded-xl text-white font-semibold text-base transition-all transform hover:scale-105 shadow-lg ${
                      waitingForCard 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    }`}
                  >
                    <span className="text-xl mr-2">✓</span>
                    <span>Correcto</span>
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={waitingForCard}
                    className={`flex items-center justify-center py-4 px-4 rounded-xl text-white font-semibold text-base transition-all transform hover:scale-105 shadow-lg ${
                      waitingForCard 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    <span className="text-xl mr-2">✗</span>
                    <span>Incorrecto</span>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePauseGame}
                  className={`h-14 text-base w-full justify-center transition-all ${
                    isPaused 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {isPaused ? (
                    <>
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Reanudar
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pausar
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRestartGame}
                  className="h-14 text-base w-full justify-center hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reiniciar
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBackToMenu}
                  className="h-14 text-base w-full justify-center hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Menú Principal
                </Button>
              </div>
            </div>
          </div>

          {/* Additional content can go here if needed */}

          </div>
          {/* Bottom spacing */}
          <div className="h-4"></div>
        </div>
      </main>

      {/* Pause indicator */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Juego en Pausa</h3>
              <p className="text-gray-600 mb-6">Presiona 'Reanudar' para continuar jugando</p>
              <div className="space-y-3">
                <Button 
                  onClick={handlePauseGame}
                  variant="primary"
                  className="w-full justify-center py-3 text-base"
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Reanudar Juego
                </Button>
                <Button 
                  onClick={() => {
                    handlePauseGame();
                    handleRestartGame();
                  }}
                  variant="outline"
                  className="w-full justify-center py-3 text-base text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reiniciar Juego
                </Button>
                <Button 
                  onClick={() => {
                    handlePauseGame();
                    handleBackToMenu();
                  }}
                  variant="outline"
                  className="w-full justify-center py-3 text-base text-red-600 border-red-200 hover:bg-red-50"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Salir al Menú
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Reiniciar Juego?</h3>
              <p className="text-gray-600 mb-6">Se perderá el progreso actual. ¿Estás seguro?</p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowRestartModal(false)}
                  variant="outline"
                  className="flex-1 justify-center py-3 text-base border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    setShowRestartModal(false);
                    confirmRestartGame();
                  }}
                  variant="primary"
                  className="flex-1 justify-center py-3 text-base bg-amber-600 hover:bg-amber-700 border-amber-600"
                >
                  Sí, Reiniciar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Confirmation Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeftIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Salir al Menú Principal?</h3>
              <p className="text-gray-600 mb-6">Se perderá el progreso del juego actual. ¿Estás seguro?</p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowMenuModal(false)}
                  variant="outline"
                  className="flex-1 justify-center py-3 text-base border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => {
                    setShowMenuModal(false);
                    confirmBackToMenu();
                  }}
                  variant="primary"
                  className="flex-1 justify-center py-3 text-base bg-red-600 hover:bg-red-700 border-red-600"
                >
                  Sí, Salir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Ajustes del Juego"
        maxWidth="md"
      >
        <div className="space-y-6 py-2">
          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Sonido</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">Efectos de sonido</p>
                <p className="text-xs text-gray-500 mt-0.5">Activa o desactiva los efectos de sonido del juego</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Apariencia</h3>
              <span className="text-xs text-gray-500">Tema de color</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Azul', from: 'from-blue-500', to: 'to-blue-600' },
                { name: 'Verde', from: 'from-emerald-500', to: 'to-emerald-600' },
                { name: 'Morado', from: 'from-purple-500', to: 'to-purple-600' },
                { name: 'Rosa', from: 'from-pink-500', to: 'to-pink-600' },
                { name: 'Ámbar', from: 'from-amber-500', to: 'to-amber-600' },
                { name: 'Cian', from: 'from-cyan-500', to: 'to-cyan-600' },
              ].map((color) => (
                <button
                  key={color.name}
                  className={`h-20 rounded-lg border-2 border-gray-100 transition-all hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden group`}
                  aria-label={`Tema ${color.name}`}
                >
                  <div className={`h-full w-full bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center text-white font-medium text-sm`}>
                    {color.name}
                    <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/20 px-2 py-1 rounded-full mt-12">
                      Aplicar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100">
            <Button 
              onClick={() => setShowSettingsModal(false)}
              variant="primary"
              className="w-full justify-center py-3 text-base"
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>

      {/* La pantalla de juego terminado ahora se maneja en la ruta /game-over */}
    </PageLayout>
  );
}