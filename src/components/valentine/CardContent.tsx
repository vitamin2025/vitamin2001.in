'use client';

import React from 'react';

interface CardContentProps {
  onYes: () => void;
  onNo: () => void;
}

const CardContent: React.FC<CardContentProps> = ({ onYes, onNo }) => {
  return (
    <div className="card-content">
      <div className="image-container">
        <div className="image-placeholder">
          <span className="heart-icon">💑</span>
          <span className="sparkles">✨</span>
        </div>
      </div>
      
      <h2 className="question">Will you be my Valentine?</h2>
      <p className="sub-text">I promise to make every moment special 💕</p>
      
      <div className="buttons">
        <button className="btn btn-yes" onClick={onYes}>
          Yes! 💖
        </button>
        <button className="btn btn-no" onClick={onNo}>
          No
        </button>
      </div>

      <style jsx>{`
        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          height: 100%;
          text-align: center;
        }

        .image-container {
          margin-bottom: 25px;
        }

        .image-placeholder {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 10px 30px rgba(252, 182, 159, 0.4);
          animation: float 3s ease-in-out infinite;
        }

        .heart-icon {
          font-size: 60px;
        }

        .sparkles {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 30px;
          animation: sparkle 2s ease-in-out infinite;
        }

        .question {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #e91e63, #ff5722);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
        }

        .sub-text {
          color: #888;
          font-size: 14px;
          margin-bottom: 30px;
        }

        .buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          padding: 14px 40px;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .btn-yes {
          background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
        }

        .btn-yes:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(255, 107, 157, 0.6);
        }

        .btn-no {
          background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
          color: #999;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .btn-no:hover {
          transform: scale(0.95);
          background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
          color: #e91e63;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(1.2) rotate(20deg); }
        }
      `}</style>
    </div>
  );
};

export default CardContent;
