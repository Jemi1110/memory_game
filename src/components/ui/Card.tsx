import type { CSSProperties } from 'react';
import type { Card as CardType } from '../../types/game';
import React from 'react';

interface CardProps {
  card: CardType;
  isFlipped?: boolean;
  isMatched?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  isFlipped = false,
  isMatched = false,
  onClick,
  className = ''
}) => {
    // Función para generar un color basado en el ID de la carta
  const getCardColor = (id: number) => {
    const colors = [
      'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
      'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #3b82f6 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
      'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #d946ef 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #3b82f6 100%)'
    ];
    // Usar el ID para seleccionar un color consistente
    return colors[Math.abs(id) % colors.length];
  };

  const cardStyle: CSSProperties = {
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
    opacity: isMatched ? 0.7 : 1,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    width: '120px',
    height: '160px',
    margin: '0.75rem',
    perspective: '1000px',
    border: 'none',
    background: 'transparent',
  };

  const faceStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const frontStyle: CSSProperties = {
    ...faceStyle,
    background: getCardColor(card.id),
    transform: 'rotateY(180deg)',
    color: 'white',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    border: '2px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
  };

  const backStyle: CSSProperties = {
    ...faceStyle,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.2)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  const getCardContent = () => {
    if (card.type === 'color') {
      return (
        <div 
          style={{
            width: '80px',
            height: '120px',
            backgroundColor: card.value,
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {card.value}
        </div>
      );
    }
    return (
      <div style={{ 
        fontSize: '2.5rem',
        color: '#2d3748',
        textTransform: 'uppercase'
      }}>
        {card.value}
      </div>
    );
  };

  return (
    <div 
      className={`card ${className}`} 
      style={cardStyle}
      onClick={!isMatched ? onClick : undefined}
      aria-label={`Carta ${card.type === 'color' ? 'de color' : 'de letra'}`}
    >
      <div className="card-back" style={backStyle}>
        <span>?</span>
      </div>
      <div className="card-front" style={frontStyle}>
        {getCardContent()}
      </div>
    </div>
  );
};

export default Card;
