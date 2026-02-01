'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ValentineCard, Toast, Confetti, getRandomExcuse } from '@/components/valentine';
import './valentine.css';

interface FloatingHeart {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  fontSize: string;
  opacity: number;
}

export default function ValentinePage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate hearts on client side only to avoid hydration mismatch
  useEffect(() => {
    const generatedHearts: FloatingHeart[] = [];
    for (let i = 0; i < 20; i++) {
      generatedHearts.push({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${10 + Math.random() * 10}s`,
        fontSize: `${10 + Math.random() * 20}px`,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }
    setHearts(generatedHearts);
    setMounted(true);
  }, []);

  const handleYes = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleNo = useCallback(() => {
    setToastMessage(getRandomExcuse());
    setShowToast(true);
  }, []);

  const handleConfettiComplete = useCallback(() => {
    router.push('/valentine/thankyou');
  }, [router]);

  const handleToastClose = useCallback(() => {
    setShowToast(false);
  }, []);

  if (!mounted) {
    return (
      <main className="valentine-page">
        <div className="card-container">
          <ValentineCard onYes={handleYes} onNo={handleNo} />
        </div>
      </main>
    );
  }

  return (
    <main className="valentine-page">
      <div className="background-hearts">
        {hearts.map((heart) => (
          <div 
            key={heart.id} 
            className="floating-heart"
            style={{
              left: heart.left,
              animationDelay: heart.animationDelay,
              animationDuration: heart.animationDuration,
              fontSize: heart.fontSize,
              opacity: heart.opacity,
            }}
          >
            💕
          </div>
        ))}
      </div>

      <div className="card-container">
        <ValentineCard onYes={handleYes} onNo={handleNo} />
      </div>

      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={handleToastClose} 
      />

      <Confetti 
        isActive={showConfetti} 
        onComplete={handleConfettiComplete} 
      />
    </main>
  );
}
