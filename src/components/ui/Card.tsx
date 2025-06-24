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
    // Mapa de colores según el valor de la carta
  const colorMap: Record<string, string> = {
    'rojo': '#ef4444',
    'azul': '#3b82f6',
    'verde': '#10b981',
    'amarillo': '#f59e0b',
    'morado': '#8b5cf6',
    'naranja': '#f97316'
  };

  // Obtener el color de fondo según el tipo de carta
  const getCardBackground = () => {
    if (card.type === 'color' && colorMap[card.value.toLowerCase()]) {
      return colorMap[card.value.toLowerCase()];
    }
    return '#ffffff';
  };

  const cardStyle: CSSProperties = {
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
    opacity: isMatched ? 0.7 : 1,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transformStyle: 'preserve-3d',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    width: '140px',
    height: '180px',
    margin: '0.5rem',
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
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
  };

  const frontStyle: CSSProperties = {
    ...faceStyle,
    backgroundColor: getCardBackground(),
    transform: 'rotateY(180deg)',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    color: 'white',
    border: '3px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s ease',
    fontSize: card.type === 'letter' ? '4.5rem' : '3.5rem',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  };

  const backStyle: CSSProperties = {
    ...faceStyle,
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'rgba(255, 255, 255, 0.9)',
    border: '3px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    fontSize: '3rem',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1) 0%, transparent 20%)',
  };

  const getCardContent = () => {
    if (card.type === 'color') {
      const textColor = card.value.toLowerCase() === 'amarillo' ? '#000000' : '#ffffff';
      return (
        <div 
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            fontSize: '1.25rem',
            fontWeight: 'bold',
            textTransform: 'capitalize',
            textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
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
        textTransform: 'uppercase',
        fontWeight: 'bold'
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
