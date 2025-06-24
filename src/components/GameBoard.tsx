import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';
import type { Card } from '../types/game';
import { PlayerScore } from './PlayerScore';
import { GameControls } from './GameControls';
import { CardDeck } from './CardDeck';
import { GameHeader } from './GameHeader';
import { GameOverModal } from './GameOverModal';

// Mover a un archivo de utilidades
function getRandomCard(deck: Card[]): Card {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return { ...deck[randomIndex] };
}

interface GameBoardProps {
  player1: string;
  player2: string;
}

export default function GameBoard({ player1, player2 }: GameBoardProps) {
  const navigate = useNavigate();
  const [currentColorCard, setCurrentColorCard] = useState<Card | null>(null);
  const [currentLetterCard, setCurrentLetterCard] = useState<Card | null>(null);
  const [usedColorCards, setUsedColorCards] = useState<number[]>([]);
  const [usedLetterCards, setUsedLetterCards] = useState<number[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  
  const {
    currentPlayer,
    currentPlayerIndex,
    timeLeft,
    isPlaying,
    playersData,
    togglePause,
    selectCard,
    answerQuestion,
    gameOver,
    waitingForCard,
    colorDeck,
    letterDeck
  } = useGameLogic({ player1, player2 });

  // Inicializar el juego con cartas aleatorias
  useEffect(() => {
    if (colorDeck.length > 0 && letterDeck.length > 0) {
      const initialColorCard = getRandomCard(colorDeck);
      const initialLetterCard = getRandomCard(letterDeck);
      
      setCurrentColorCard(initialColorCard);
      setCurrentLetterCard(initialLetterCard);
    }
  }, [gameOver, colorDeck, letterDeck]);

  const handleCardSelect = (deckType: 'colors' | 'letters') => {
    if (!waitingForCard) return;
    
    // Actualizar la carta mostrada para la baraja seleccionada
    if (deckType === 'colors') {
      const availableCards = colorDeck.filter((card: Card) => !usedColorCards.includes(card.id));
      const newCard = availableCards.length > 0 
        ? getRandomCard(availableCards)
        : getRandomCard(colorDeck);
      
      setCurrentColorCard(newCard);
      setUsedColorCards(prev => [...prev, newCard.id]);
    } else {
      const availableCards = letterDeck.filter((card: Card) => !usedLetterCards.includes(card.id));
      const newCard = availableCards.length > 0 
        ? getRandomCard(availableCards)
        : getRandomCard(letterDeck);
      
      setCurrentLetterCard(newCard);
      setUsedLetterCards(prev => [...prev, newCard.id]);
    }
    
    // Notificar la selección de carta y avanzar al siguiente turno
    selectCard(deckType);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (waitingForCard) return;
    answerQuestion(isCorrect);
  };

  // Manejar el fin del juego
  useEffect(() => {
    if (gameOver) {
      const losingPlayer = playersData.find(player => player.score <= -100);
      
      if (losingPlayer) {
        navigate('/game-over', {
          state: {
            players: playersData,
            loser: losingPlayer,
            reason: 'negative_score' as const
          }
        });
      } else {
        setShowGameOver(true);
      }
    }
  }, [gameOver, playersData, navigate]);

  const handleRestart = () => {
    window.location.reload();
  };

  // Determinar si hay un empate o un ganador
  const winner = playersData[0].score > playersData[1].score 
    ? playersData[0] 
    : playersData[1].score > playersData[0].score 
      ? playersData[1] 
      : null;
  
  const isTie = playersData[0].score === playersData[1].score && playersData[0].score > 0;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <GameHeader 
        currentPlayer={currentPlayer.name}
        player1={player1}
        player2={player2}
        currentPlayerIndex={currentPlayerIndex}
      />
      
      <GameControls
        timeLeft={timeLeft}
        isPlaying={isPlaying}
        waitingForCard={waitingForCard}
        onAnswer={handleAnswer}
        onTogglePause={togglePause}
      />
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {playersData.map((player, index) => (
          <PlayerScore
            key={index}
            player={player}
            isCurrentPlayer={currentPlayer.name === player.name}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <CardDeck
          type="colors"
          card={currentColorCard}
          waitingForCard={waitingForCard}
          onSelect={handleCardSelect}
        />
        
        <CardDeck
          type="letters"
          card={currentLetterCard}
          waitingForCard={waitingForCard}
          onSelect={handleCardSelect}
        />
      </div>
      
      <div className="mt-4 text-center">
        <p className={`font-medium ${
          waitingForCard 
            ? 'text-green-600 animate-pulse' 
            : 'text-blue-600'
        }`}>
          {waitingForCard 
            ? '¡Respuesta registrada! Selecciona una baraja para continuar' 
            : 'Marca si la respuesta es correcta o incorrecta'}
        </p>
      </div>
      
      {showGameOver && (
        <GameOverModal
          players={playersData}
          winner={winner}
          isTie={isTie}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}