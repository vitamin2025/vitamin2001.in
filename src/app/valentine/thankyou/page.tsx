'use client';

import React, { useState, useEffect } from 'react';
import '../valentine.css';

interface ThankYouHeart {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  fontSize: string;
}

export default function ThankYouPage() {
  const [hearts, setHearts] = useState<ThankYouHeart[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate hearts on client side only to avoid hydration mismatch
  useEffect(() => {
    const generatedHearts: ThankYouHeart[] = [];
    for (let i = 0; i < 15; i++) {
      generatedHearts.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        fontSize: `${20 + Math.random() * 30}px`,
      });
    }
    setHearts(generatedHearts);
    setMounted(true);
  }, []);

  return (
    <main className="thankyou-page">
      {mounted && (
        <div className="thankyou-hearts">
          {hearts.map((heart) => (
            <div 
              key={heart.id} 
              className="thankyou-heart"
              style={{
                left: heart.left,
                top: heart.top,
                animationDelay: heart.animationDelay,
                fontSize: heart.fontSize,
              }}
            >
              💖
            </div>
          ))}
        </div>
      )}

      <div className="thankyou-content">
        <video 
          className="thankyou-video-bg"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source 
            src="https://fra.cloud.appwrite.io/v1/storage/buckets/68eb6558002f5d94b901/files/697f45e8002ffd03709c/view?project=67fcae5000090ef424bd&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjk3ZjQ2MWIwN2UxZWI1NDRlZDAiLCJyZXNvdXJjZUlkIjoiNjhlYjY1NTgwMDJmNWQ5NGI5MDE6Njk3ZjQ1ZTgwMDJmZmQwMzcwOWMiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjQzNjI0OjMiLCJpYXQiOjE3Njk5NDg2OTksImV4cCI6MTc3MjQ5NjAwMH0.z6OmTF1tTH0dyarL39DAlGcS6CXgESJOOdZ_bkKvtqg" 
            type="video/mp4" 
          />
        </video>
        <div className="thankyou-overlay"></div>
        <span className="thankyou-emoji">💝</span>
        <h1 className="thankyou-title">Yay! Thank You!</h1>
        <p className="thankyou-message">
          You just made me the happiest person in the world! 
          I promise to make this Valentine&apos;s Day unforgettable 
          and fill every moment with love and joy.
        </p>
        <p className="thankyou-signature">
          Forever yours 💕
        </p>
        <span className="couple-emoji">👩‍❤️‍👨</span>
      </div>
    </main>
  );
}
