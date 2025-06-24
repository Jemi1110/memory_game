import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Card as CardType } from '../types/game';
import Card from './ui/Card';

interface CardDeckProps {
  type: 'colors' | 'letters';
  card: CardType | null;
  waitingForCard: boolean;
  onSelect: (type: 'colors' | 'letters') => void;
  isActive?: boolean;
}

export const CardDeck: React.FC<CardDeckProps> = ({ 
  type, 
  card, 
  waitingForCard, 
  onSelect,
  isActive = false
}) => {
  const isColorDeck = type === 'colors';
  const deckName = isColorDeck ? 'Colores' : 'Letras';
  const prevCard = useRef<CardType | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card) {
      prevCard.current = card;
    }
  }, [card]);

  const handleClick = () => {
    if (waitingForCard) {
      // Efecto de click
      if (cardRef.current) {
        cardRef.current.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transform = 'scale(1)';
          }
        }, 100);
      }
      onSelect(type);
    }
  };

  const deckStyle = {
    transform: waitingForCard ? 'translateY(-5px)' : 'none',
    boxShadow: waitingForCard 
      ? '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderColor: isActive ? '#3b82f6' : '#e5e7eb',
    opacity: waitingForCard ? 1 : 0.8,
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <motion.div
      className={`relative bg-white p-6 rounded-xl overflow-hidden 
        ${waitingForCard ? 'cursor-pointer' : 'cursor-default'}
        border-2 border-transparent`}
      style={deckStyle}
      onClick={handleClick}
      whileHover={waitingForCard ? { scale: 1.02 } : {}}
      whileTap={waitingForCard ? { scale: 0.98 } : {}}
    >
      {/* Efecto de resplandor cuando está activo */}
      {waitingForCard && (
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

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          {waitingForCard ? (
            <motion.span 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-blue-600"
            >
              Selecciona una carta
            </motion.span>
          ) : (
            `Mazo de ${deckName}`
          )}
        </h2>

        <div className="relative h-64 flex items-center justify-center">
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
                className="h-48 w-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl 
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

        <p className="text-center text-sm text-gray-500 mt-4">
          {waitingForCard 
            ? 'Elige una carta para continuar' 
            : 'Esperando tu turno...'}
        </p>
      </div>
    </motion.div>
  );
};
