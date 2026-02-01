'use client';

import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  type: 'heart' | 'sparkle' | 'star';
  size: number;
  rotation: number;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive, onComplete }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      const types: ('heart' | 'sparkle' | 'star')[] = ['heart', 'sparkle', 'star'];
      
      for (let i = 0; i < 80; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2,
          type: types[Math.floor(Math.random() * types.length)],
          size: 10 + Math.random() * 20,
          rotation: Math.random() * 360,
        });
      }
      setPieces(newPieces);

      // Call onComplete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const getEmoji = (type: string) => {
    switch (type) {
      case 'heart': return '💕';
      case 'sparkle': return '✨';
      case 'star': return '⭐';
      default: return '💖';
    }
  };

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            fontSize: `${piece.size}px`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        >
          {getEmoji(piece.type)}
        </div>
      ))}
      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
          overflow: hidden;
        }

        .confetti-piece {
          position: absolute;
          top: -50px;
          animation: confetti-fall linear forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 1;
          }
          10% {
            transform: translateY(10vh) rotate(90deg) scale(1);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
