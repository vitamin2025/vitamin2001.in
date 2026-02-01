'use client';

import React, { useState } from 'react';
import CardContent from './CardContent';

interface ValentineCardProps {
  onYes: () => void;
  onNo: () => void;
}

const ValentineCard: React.FC<ValentineCardProps> = ({ onYes, onNo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="card-wrapper">
      <div 
        className={`card ${isOpen ? 'is-open' : ''}`}
        onClick={handleCardClick}
      >
        {/* Card Front */}
        <div className="card-face card-front">
          <div className="card-decoration top-left">💕</div>
          <div className="card-decoration top-right">✨</div>
          <div className="card-decoration bottom-left">🌹</div>
          <div className="card-decoration bottom-right">💖</div>
          
          <div className="front-content">
            <div className="envelope-flap"></div>
            <div className="heart-seal">💌</div>
            <h1 className="front-title">Hey, Miss Sneha</h1>
            <p className="front-subtitle">You have a message,</p>
            <p className="front-subtitle">Click to open 💝</p>
          </div>
        </div>

        {/* Card Back */}
        <div className="card-face card-back">
          <CardContent onYes={onYes} onNo={onNo} />
        </div>
      </div>

      <style jsx>{`
        .card-wrapper {
          perspective: 1500px;
          width: 100%;
          max-width: 380px;
          height: 520px;
        }

        .card {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
          cursor: pointer;
        }

        .card.is-open {
          transform: rotateY(180deg);
          cursor: default;
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 24px;
          overflow: hidden;
        }

        .card-front {
          background: linear-gradient(145deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 25px 50px -12px rgba(255, 154, 158, 0.5),
                      0 0 0 1px rgba(255, 255, 255, 0.3) inset;
        }

        .card-back {
          background: linear-gradient(145deg, #ffffff 0%, #fff5f5 100%);
          transform: rotateY(180deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15),
                      0 0 0 1px rgba(255, 182, 193, 0.3) inset;
        }

        .card-decoration {
          position: absolute;
          font-size: 24px;
          opacity: 0.8;
          animation: float-decoration 4s ease-in-out infinite;
        }

        .top-left { top: 20px; left: 20px; animation-delay: 0s; }
        .top-right { top: 20px; right: 20px; animation-delay: 1s; }
        .bottom-left { bottom: 20px; left: 20px; animation-delay: 2s; }
        .bottom-right { bottom: 20px; right: 20px; animation-delay: 3s; }

        .front-content {
          text-align: center;
          position: relative;
        }

        .envelope-flap {
          width: 120px;
          height: 60px;
          background: linear-gradient(135deg, #fff 0%, #ffe0e6 100%);
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          border-radius: 5px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .heart-seal {
          font-size: 50px;
          margin-bottom: 20px;
          animation: pulse 2s ease-in-out infinite;
        }

        .front-title {
          font-size: 42px;
          font-weight: 800;
          color: white;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .front-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes float-decoration {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(10deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default ValentineCard;
