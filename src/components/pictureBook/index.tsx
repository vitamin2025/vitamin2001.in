'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  caption: string;
  date: string;
  leftText?: string;
  rightText?: string;
}

export default function PictureBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  // Sample photos - replace with your actual photos
  const photos: Photo[] = useMemo(() => [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
      caption: 'The Beginning',
      date: 'January 2024',
      leftText: 'Our Story',
      rightText: 'When I first saw you, my heart knew you were the one...'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&q=80',
      caption: 'Coffee & Conversations',
      date: 'February 2024',
      leftText: 'First Date',
      rightText: 'Hours felt like minutes when I was with you. Your smile lit up the entire café.'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
      caption: 'Making It Official',
      date: 'March 2024',
      leftText: 'You & Me',
      rightText: 'The day you said yes was the happiest day of my life.'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
      caption: 'Beach Adventures',
      date: 'May 2024',
      leftText: 'Seaside Memories',
      rightText: 'Collecting seashells and making memories that will last forever.'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80',
      caption: 'City Lights',
      date: 'July 2024',
      leftText: 'Night Walks',
      rightText: 'Every street corner became magical when walking hand in hand with you.'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1501933097754-1e41474e59d5?w=800&q=80',
      caption: 'Nature Lovers',
      date: 'September 2024',
      leftText: 'Into the Wild',
      rightText: 'Getting lost together in nature, finding ourselves in each other.'
    },
  ], []);

  const totalPages = photos.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const currentPhoto = photos[currentPage];

  // Generate random decorative elements positions
  const decorativeHearts = useMemo(() => {
    return [...Array(8)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 3
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative floating hearts */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        {decorativeHearts.map((heart, i) => (
          <div
            key={i}
            className="absolute text-rose-400"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.size}px`,
              animation: `float ${heart.duration}s ease-in-out infinite`,
              animationDelay: `${heart.delay}s`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="max-w-7xl w-full mx-auto">
        {/* Book Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-rose-500 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Our Love Story
            </h1>
            <Sparkles className="w-8 h-8 text-rose-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600 italic">A Picture Book of Us 💕</p>
        </div>

        {/* Book Container */}
        <div className="relative perspective-2000">
          <div className="relative w-full max-w-5xl mx-auto" style={{ aspectRatio: '16/10' }}>
            {/* Book Shadow */}
            <div className="absolute inset-0 bg-black/20 blur-3xl transform translate-y-8 scale-95 rounded-3xl"></div>

            {/* Book */}
            <div className="relative w-full h-full bg-amber-100 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-200">
              {/* Book Spine Effect */}
              <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-300/50 via-amber-400/30 to-transparent transform -translate-x-1/2 z-20"></div>

              {/* Pages Container */}
              <div className="relative w-full h-full flex">
                {/* Left Page */}
                <div className={`w-1/2 h-full bg-gradient-to-br from-amber-50 to-orange-50 p-8 md:p-12 flex flex-col justify-center items-center border-r-2 border-amber-200/50 relative overflow-hidden transition-all duration-700 ${
                  isFlipping && flipDirection === 'next' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                }`}>
                  {/* Decorative corner */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-rose-300 opacity-30"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-rose-300 opacity-30"></div>

                  <div className="text-center space-y-4">
                    <Heart className="w-12 h-12 text-rose-400 mx-auto animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-bold text-rose-700" style={{ fontFamily: 'cursive' }}>
                      {currentPhoto.leftText}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto"></div>
                    <p className="text-rose-600 font-semibold text-lg">{currentPhoto.date}</p>
                  </div>
                </div>

                {/* Right Page */}
                <div className={`w-1/2 h-full bg-gradient-to-br from-orange-50 to-amber-50 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden transition-transform duration-700 transform-gpu ${
                  isFlipping && flipDirection === 'next' ? 'animate-flip-next' : isFlipping && flipDirection === 'prev' ? 'animate-flip-prev' : ''
                }`}>
                  {/* Decorative corner */}
                  <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-rose-300 opacity-30"></div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-rose-300 opacity-30"></div>

                  {/* Photo Frame */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      {/* Polaroid-style frame */}
                      <div className="bg-white p-4 shadow-xl transform hover:rotate-2 transition-transform duration-300 rounded-lg">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                          <img
                            src={currentPhoto.url}
                            alt={currentPhoto.caption}
                            className="w-full h-full object-cover"
                          />
                          {/* Photo overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                        {/* Polaroid caption */}
                        <div className="mt-3 text-center">
                          <p className="text-gray-700 font-handwriting text-lg">{currentPhoto.caption}</p>
                        </div>
                      </div>

                      {/* Decorative tape */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-amber-200/60 rounded-sm rotate-2 shadow-md"></div>
                    </div>
                  </div>

                  {/* Text Below Photo */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-700 italic leading-relaxed text-base md:text-lg">
                      {currentPhoto.rightText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 right-8 text-amber-700 font-semibold text-sm">
                Page {currentPage + 1} of {totalPages}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0 || isFlipping}
              className={`pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${
                currentPage === 0 || isFlipping
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-90 hover:opacity-100 hover:shadow-xl'
              }`}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1 || isFlipping}
              className={`pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${
                currentPage === totalPages - 1 || isFlipping
                  ? 'opacity-30 cursor-not-allowed'
                  : 'opacity-90 hover:opacity-100 hover:shadow-xl'
              }`}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isFlipping && index !== currentPage) {
                  setIsFlipping(true);
                  setFlipDirection(index > currentPage ? 'next' : 'prev');
                  setTimeout(() => {
                    setCurrentPage(index);
                    setIsFlipping(false);
                  }, 600);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'bg-rose-500 w-8'
                  : 'bg-rose-300 hover:bg-rose-400'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-gray-600 animate-fade-in-delayed">
          <p className="text-sm">Click the arrows or dots to turn the pages 📖</p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .perspective-2000 {
          perspective: 2000px;
        }

        @keyframes flip-next {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          51% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes flip-prev {
          0% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          51% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }

        .animate-flip-next {
          animation: flip-next 0.6s ease-in-out;
        }

        .animate-flip-prev {
          animation: flip-prev 0.6s ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }


        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }

        .animate-fade-in-delayed {
          animation: fadeIn 1.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .font-handwriting {
          font-family: 'Brush Script MT', cursive;
        }
      `}</style>
    </div>
  );
}

