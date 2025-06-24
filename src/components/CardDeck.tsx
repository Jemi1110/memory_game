import React, { useEffect, useRef, useContext } from 'react';
import { AudioContext } from '../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';
import type { Card as CardType } from '../types/game';
import Card from './ui/Card';

interface CardDeckProps {
  type: 'colors' | 'letters';
  card: CardType | null;
  waitingForCard: boolean;
  onSelect: (type: 'colors' | 'letters') => void;
  isActive?: boolean;
  isSelecting?: boolean;
}

export const CardDeck: React.FC<CardDeckProps> = ({ 
  type, 
  card, 
  waitingForCard, 
  onSelect,
  isActive = false,
  isSelecting = false
}) => {
  const isColorDeck = type === 'colors';
  const deckName = isColorDeck ? 'Colores' : 'Letras';
  const prevCard = useRef<CardType | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { playSound } = useContext(AudioContext);

  useEffect(() => {
    if (card) {
      prevCard.current = card;
    }
  }, [card]);

  const handleClick = React.useCallback(() => {
    console.log('CardDeck clicked:', { 
      type, 
      waitingForCard, 
      isActive, 
      isSelecting,
      card: card?.id,
      timestamp: Date.now()
    });
    
    // Play card flip sound
    playSound('correct');
    
    // Check if we're in a valid state to select
    if (!waitingForCard) {
      console.log('Not waiting for card selection, ignoring click');
      return;
    }
    
    // Prevent rapid multiple clicks
    if (isSelecting) {
      console.log('Already selecting, ignoring click');
      return;
    }
    
    console.log('CardDeck click processed, calling onSelect');
    
    // Efecto de click visual
    if (cardRef.current) {
      cardRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = 'scale(1)';
        }
      }, 100);
    }
    
    try {
      // Llamar a la función de selección
      console.log('Calling onSelect with type:', type);
      onSelect(type);
    } catch (error) {
      console.error('Error in handleClick:', error);
    }
  }, [type, waitingForCard, isActive, isSelecting, onSelect, card?.id]);

  const deckStyle: React.CSSProperties = {
    transform: isActive ? 'translateY(-5px)' : 'none',
    boxShadow: isActive 
      ? '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderColor: isActive ? '#3b82f6' : isSelecting ? '#f59e0b' : '#e5e7eb',
    borderWidth: '2px',
    borderStyle: 'solid',
    opacity: waitingForCard ? 1 : 0.8,
    transition: 'all 0.3s ease-in-out',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  return (
    <motion.div
      className={`relative h-full w-full min-h-[400px] bg-white p-6 rounded-2xl overflow-hidden 
        ${waitingForCard ? 'cursor-pointer hover:shadow-xl' : 'cursor-default'}
        border-2 border-gray-100 flex flex-col transition-all duration-300`}
      style={deckStyle}
      onClick={handleClick}
      whileHover={waitingForCard ? { scale: 1.01, y: -4 } : {}}
      whileTap={waitingForCard ? { scale: 0.99 } : {}}
    >
      {/* Efecto de resplandor cuando está activo */}
      {isSelecting && (
        <motion.div 
          className="absolute inset-0 bg-yellow-500 opacity-20 rounded-lg z-0"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      )}
      {isActive && !isSelecting && (
        <motion.div 
          className="absolute inset-0 bg-blue-500 opacity-0 rounded-lg"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      )}

      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {waitingForCard ? (
            <motion.span 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-blue-600"
            >
              Haz clic para seleccionar
            </motion.span>
          ) : (
            `Mazo de ${deckName}`
          )}
        </h2>

        <div className="relative flex-1 flex items-center justify-center p-6 w-full">
          <AnimatePresence>
            {card ? (
              <motion.div
                key={card.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute"
                ref={cardRef}
              >
                <Card 
                  card={card} 
                  isFlipped={true} 
                  isMatched={false}
                  onClick={() => {}}
                />
              </motion.div>
            ) : (
              <motion.div 
                className="h-48 w-full max-w-xs bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl 
                  flex items-center justify-center shadow-inner border-2 border-dashed border-gray-300"
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <span className="text-gray-400 text-sm font-medium">
                  Haz clic para comenzar
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          {waitingForCard 
            ? 'Elige una carta para continuar' 
            : 'Esperando tu turno...'}
        </p>
      </div>
    </motion.div>
  );
};
