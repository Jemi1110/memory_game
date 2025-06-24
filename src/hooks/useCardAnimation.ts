import { useState, useCallback } from 'react';

export const useCardAnimation = () => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());

  const flipCard = useCallback((id: number) => {
    setFlippedCards(prev => {
      const newFlipped = new Set(prev);
      newFlipped.add(id);
      return newFlipped;
    });
  }, []);

  const unflipCard = useCallback((id: number) => {
    setFlippedCards(prev => {
      const newFlipped = new Set(prev);
      newFlipped.delete(id);
      return newFlipped;
    });
  }, []);

  const markAsMatched = useCallback((id: number) => {
    setMatchedCards(prev => {
      const newMatched = new Set(prev);
      newMatched.add(id);
      return newMatched;
    });
  }, []);

  const resetCards = useCallback(() => {
    setFlippedCards(new Set());
    setMatchedCards(new Set());
  }, []);

  return {
    flippedCards,
    matchedCards,
    flipCard,
    unflipCard,
    markAsMatched,
    resetCards
  };
};
