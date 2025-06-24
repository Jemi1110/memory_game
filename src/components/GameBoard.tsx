import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioContext } from '../utils/audio';
import { useGameLogic } from '../hooks/useGameLogic';
import type { Card } from '../types/game';
import { CardDeck } from './CardDeck';

// Mover a un archivo de utilidades
function getRandomCard(deck: Card[]): Card {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return { ...deck[randomIndex] };
}

interface GameBoardProps {
  player1: string;
  player2: string;
  waitingForCard: boolean;
  onSelectCard: (deckType: 'colors' | 'letters') => boolean;
  onGameOver?: (players: any[], winner: any, isTie: boolean) => void;
  children?: React.ReactNode;
}

export default function GameBoard({ player1, player2, waitingForCard: propWaitingForCard, onSelectCard, onGameOver, children }: GameBoardProps) {
  const [currentColorCard, setCurrentColorCard] = useState<Card | null>(null);
  const [currentLetterCard, setCurrentLetterCard] = useState<Card | null>(null);
  const [usedColorCards, setUsedColorCards] = useState<number[]>([]);
  const [usedLetterCards, setUsedLetterCards] = useState<number[]>([]);
  const navigate = useNavigate();

  const {
    state: { players: playersData, gameOver },
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

  const [selectedDeck, setSelectedDeck] = useState<'colors' | 'letters' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const selectionInProgress = useRef(false);
  const { playSound } = useContext(AudioContext);

  // Efecto para manejar la selección de cartas
  useEffect(() => {
    if (!propWaitingForCard) {
      // Resetear la selección cuando termina el turno
      console.log('Resetting deck selection at end of turn');
      setSelectedDeck(null);
      selectionInProgress.current = false;
    }
  }, [propWaitingForCard]);

  const handleCardSelect = useCallback(async (deckType: 'colors' | 'letters') => {
    console.log('handleCardSelect called with:', { 
      deckType, 
      waitingForCard: propWaitingForCard,
      isAnimating,
      selectionInProgress: selectionInProgress.current,
      currentColorCard: currentColorCard?.id,
      currentLetterCard: currentLetterCard?.id,
      usedColorCards,
      usedLetterCards
    });

    // Verificar si podemos seleccionar una carta
    if (!propWaitingForCard) {
      console.log('Not waiting for card selection, current state:', { 
        waitingForCard: propWaitingForCard, 
        isAnimating,
        selectionInProgress: selectionInProgress.current 
      });
      return;
    }

    if (isAnimating || selectionInProgress.current) {
      console.log('Selection in progress, ignoring click', { 
        isAnimating, 
        selectionInProgress: selectionInProgress.current 
      });
      return;
    }

    // Mark that we're in the process of selection
    selectionInProgress.current = true;
    console.log('Starting card selection for:', deckType);
    
    // Play card flip sound
    playSound('correct');
    
    // Mark that we're in the process of animation
    setIsAnimating(true);
    setSelectedDeck(deckType);

    try {
      // Obtener una nueva carta aleatoria para la baraja seleccionada
      let newCard: Card;
      
      if (deckType === 'colors') {
        const availableCards = colorDeck.filter((card: Card) => !usedColorCards.includes(card.id));
        newCard = availableCards.length > 0 
          ? getRandomCard(availableCards)
          : getRandomCard(colorDeck);
        
        console.log('Selected new color card:', newCard);
        setCurrentColorCard(newCard);
        setUsedColorCards(prev => [...prev, newCard.id]);
      } else {
        const availableCards = letterDeck.filter((card: Card) => !usedLetterCards.includes(card.id));
        newCard = availableCards.length > 0 
          ? getRandomCard(availableCards)
          : getRandomCard(letterDeck);
        
        console.log('Selected new letter card:', newCard);
        setCurrentLetterCard(newCard);
        setUsedLetterCards(prev => [...prev, newCard.id]);
      }

      // Esperar un momento para la animación antes de notificar la selección
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Calling selectCard with:', deckType);
      const success = onSelectCard(deckType);
      console.log('selectCard result:', success);
      
      if (!success) {
        console.error('Card selection failed');
        throw new Error('Card selection failed');
      }
      
      console.log('Card selected successfully, waiting for next turn');
      
      // Esperar un momento antes de limpiar la animación
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error('Error during card selection:', error);
      // En caso de error, restaurar el estado de la carta
      if (deckType === 'colors') {
        setCurrentColorCard(null);
      } else {
        setCurrentLetterCard(null);
      }
    } finally {
      // Siempre limpiar el estado de animación y selección
      console.log('Resetting animation state after card selection');
      setIsAnimating(false);
      setSelectedDeck(null);
      selectionInProgress.current = false;
    }
  }, [
    propWaitingForCard, 
    isAnimating, 
    onSelectCard, 
    colorDeck, 
    letterDeck, 
    usedColorCards, 
    usedLetterCards, 
    currentColorCard, 
    currentLetterCard
  ]);

  // Manejar el fin del juego a través del callback
  useEffect(() => {
    if (gameOver) {
      const winner = playersData[0].score > playersData[1].score ? playersData[0] : playersData[1];
      const isTie = playersData[0].score === playersData[1].score;
      const losingPlayer = playersData.find(player => player.score <= -100);
      
      if (onGameOver) {
        onGameOver(playersData, isTie ? null : winner, isTie);
      } else if (losingPlayer) {
        // Por compatibilidad hacia atrás
        navigate('/game-over', {
          state: {
            players: playersData,
            winner: isTie ? null : winner,
            loser: losingPlayer,
            reason: 'negative_score' as const,
            from: 'game-board',
            timestamp: Date.now()
          },
          replace: true
        });
      }
    }
  }, [gameOver, playersData, onGameOver, navigate]);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Game Area */}
      <div className="flex-1 flex flex-col p-2">
        {/* Card Decks */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-[3000px] mx-auto">
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {propWaitingForCard ? 'Selecciona una carta' : 'Carta Actual'}
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <CardDeck 
                type="colors" 
                card={currentColorCard} 
                waitingForCard={propWaitingForCard}
                onSelect={() => handleCardSelect('colors')} 
                isActive={propWaitingForCard && !isAnimating}
                isSelecting={selectedDeck === 'colors'}
              />
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {propWaitingForCard ? 'Selecciona una carta' : 'Carta Actual'}
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <CardDeck 
                type="letters" 
                card={currentLetterCard} 
                waitingForCard={propWaitingForCard}
                onSelect={() => handleCardSelect('letters')} 
                isActive={propWaitingForCard && !isAnimating}
                isSelecting={selectedDeck === 'letters'}
              />
            </div>
          </div>
        </div>

        {/* Los botones de respuesta ahora se manejan desde el componente padre */}
        {children}
      </div>

      {/* El manejo de game over ahora se hace a través de la página GameOverPage */}
    </div>
  );
}
