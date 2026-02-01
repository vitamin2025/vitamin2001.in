'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <span className="toast-icon">💝</span>
        <span className="toast-message">{message}</span>
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          animation: toast-slide-up 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #ff6b9d 0%, #ff8a80 50%, #ffab91 100%);
          padding: 16px 28px;
          border-radius: 50px;
          box-shadow: 0 10px 40px rgba(255, 107, 157, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
          backdrop-filter: blur(10px);
        }

        .toast-icon {
          font-size: 24px;
          animation: heartbeat 1s ease-in-out infinite;
        }

        .toast-message {
          color: white;
          font-size: 16px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
        }

        @keyframes toast-slide-up {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(100px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export const cuteExcuses = [
  "That button doesn't work 💕",
  "Wrong answer, try again! 😘",
  "Error 404: 'No' not found 💝",
  "Oops! That's not an option 🌹",
  "Nice try, but no! 💖",
  "Hmm... are you sure? Think again! 🥰",
  "The 'No' button is broken, sorry! 💗",
  "Nope, that's not how this works 😉",
  "My heart says you meant 'Yes' 💓",
  "Loading... 'No' functionality unavailable 🔄",
];

export const getRandomExcuse = () => {
  return cuteExcuses[Math.floor(Math.random() * cuteExcuses.length)];
};

export default Toast;
