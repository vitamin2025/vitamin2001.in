"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Calendar, Camera, MapPin, Sparkles } from 'lucide-react';

// Utils
import { storage } from "../../lib/appwrite";
import { ImageFormat, ImageGravity } from "appwrite";
import Image from "next/image";

export default function OurLoveStory() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  const getPictures = (fileId: string): string => {

    const result = storage.getFilePreview(
      '68eb6558002f5d94b901',
      fileId,
      0, // optional
      0, // optional
      ImageGravity.Center, // optional
      -1, // optional
      0, // optional
      'e8ecf7', // optional
      0, // optional
      0, // optional
      -360, // optional
      'e8ecf7', // optional
      ImageFormat.Jpg, // optional
    );

    return result;

  }

  // Generate random heart positions once to avoid hydration issues
  const heartPositions = useMemo(() => {
    return [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      fontSize: Math.random() * 30 + 20,
      animationDelay: Math.random() * 5,
      animationDuration: Math.random() * 3 + 2
    }));
  }, []);

  useEffect(() => {
    const startDate = new Date('2025-07-02');
    const today = new Date();
    const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const hoursTogether = daysTogether * 24;

    // Animate counters
    let dayCount = 0;
    let hourCount = 0;
    const dayIncrement = daysTogether / 100;
    const hourIncrement = hoursTogether / 100;


    const interval = setInterval(() => {
      dayCount += dayIncrement;
      hourCount += hourIncrement;

      if (dayCount >= daysTogether) {
        setDays(daysTogether);
        setHours(hoursTogether);
        clearInterval(interval);
      } else {
        setDays(Math.floor(dayCount));
        setHours(Math.floor(hourCount));
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const timelineEvents = [
    {
      date: 'January 15, 2024',
      title: 'The Day We Met',
      icon: Sparkles,
      description: 'Our eyes met across the room, and somehow, I just knew you were special. That first conversation felt like coming home.',
      color: 'from-pink-400 to-rose-400'
    },
    {
      date: 'February 14, 2024',
      title: 'First Date',
      icon: Heart,
      description: 'Coffee turned into dinner, dinner into a moonlit walk. Time flew by as we discovered each other\'s dreams and quirks.',
      color: 'from-rose-400 to-pink-500'
    },
    {
      date: 'March 20, 2024',
      title: 'Made It Official',
      icon: Heart,
      description: 'Under the stars, you took my hand and asked me to be yours. I said yes without a moment\'s hesitation.',
      color: 'from-pink-500 to-purple-400'
    },
    {
      date: 'June 10, 2024',
      title: 'First Adventure',
      icon: MapPin,
      description: 'Our first trip together! Getting lost never felt so right. Every wrong turn became a cherished memory.',
      color: 'from-purple-400 to-pink-400'
    },
    {
      date: 'September 5, 2024',
      title: 'Anniversary Celebration',
      icon: Calendar,
      description: 'Six months of laughter, growth, and unconditional love. Here\'s to forever and always, my darling.',
      color: 'from-pink-400 to-rose-500'
    }
  ];

  const photos = [
    { title: 'First Date', emoji: '☕', url: getPictures('68eb66f60011ccfa1021') },
    { title: 'Adventure Together', emoji: '🌄' },
    { title: 'Sunset Moments', emoji: '🌅' },
    { title: 'Cozy Times', emoji: '🏠' },
    { title: 'Celebrations', emoji: '🎉' },
    { title: 'Just Us', emoji: '💕' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Floating hearts background */}
      <div className="pointer-events-none fixed inset-0 opacity-10">
        {heartPositions.map((heart, i) => (
          <div
            key={i}
            className="absolute animate-pulse text-pink-400"
            style={{
              left: `${heart.left}%`,
              top: `${heart.top}%`,
              fontSize: `${heart.fontSize}px`,
              animationDelay: `${heart.animationDelay}s`,
              animationDuration: `${heart.animationDuration}s`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="animate-fade-in py-16 text-center">
          <h1
            className="mb-4 text-6xl font-bold text-pink-600 md:text-7xl"
            style={{ fontFamily: "cursive" }}
          >
            Our Love Story
          </h1>
          <p className="text-xl text-purple-700 italic md:text-2xl">
            Every moment with you is a treasure 💕
          </p>
        </header>

        {/* Time Together Stats */}
        <div className="mb-12 rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-lg md:p-12">
          <h2
            className="mb-8 text-center text-4xl font-bold text-pink-600"
            style={{ fontFamily: "cursive" }}
          >
            Time Together
            <span className="mt-2 block text-2xl">♥</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="transform rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 p-8 text-center transition-transform hover:scale-105">
              <div className="text-5xl font-bold text-pink-600">{days}</div>
              <div className="mt-2 text-lg text-purple-700">Days Together</div>
            </div>
            <div className="transform rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-8 text-center transition-transform hover:scale-105">
              <div className="text-5xl font-bold text-pink-600">{hours}</div>
              <div className="mt-2 text-lg text-purple-700">
                Hours of Happiness
              </div>
            </div>
            <div className="transform rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 p-8 text-center transition-transform hover:scale-105">
              <div className="text-5xl font-bold text-pink-600">∞</div>
              <div className="mt-2 text-lg text-purple-700">
                Memories Created
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-12 rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-lg md:p-12">
          <h2
            className="mb-8 text-center text-4xl font-bold text-pink-600"
            style={{ fontFamily: "cursive" }}
          >
            Our Memories
            <span className="mt-2 block text-2xl">♥</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="flex aspect-square transform cursor-pointer flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 shadow-lg transition-all hover:scale-105 hover:-rotate-2 hover:shadow-2xl"
              >
                {photo.url && <Image
                  src={photo.url}
                  alt={index as unknown as string}
                  width={100}
                  height={100}
                />}
                <Camera className="mb-2 h-8 w-8 text-pink-600" />
                <div className="text-lg font-semibold text-purple-800">
                  {photo.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12 rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-lg md:p-12">
          <h2
            className="mb-12 text-center text-4xl font-bold text-pink-600"
            style={{ fontFamily: "cursive" }}
          >
            Our Journey
            <span className="mt-2 block text-2xl">♥</span>
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform rounded-full bg-gradient-to-b from-pink-400 via-rose-500 to-pink-400 md:block"></div>

            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <div
                  key={index}
                  className={`relative mb-12 flex flex-col md:mb-16 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8`}
                >
                  {/* Content */}
                  <div
                    className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                  >
                    <div className="transform rounded-2xl bg-gradient-to-br from-white to-pink-50 p-6 shadow-lg transition-transform hover:scale-105">
                      <div className="mb-2 text-lg font-bold text-pink-600">
                        {event.date}
                      </div>
                      <div className="mb-3 flex items-center justify-start gap-2 text-2xl font-bold text-purple-800 md:justify-end">
                        {index % 2 === 0 && <Icon className="h-6 w-6" />}
                        <span>{event.title}</span>
                        {index % 2 !== 0 && <Icon className="h-6 w-6" />}
                      </div>
                      <p className="leading-relaxed text-purple-700">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden w-2/12 justify-center md:flex">
                    <div
                      className={`h-8 w-8 bg-gradient-to-br ${event.color} z-10 rounded-full border-4 border-white shadow-lg`}
                    ></div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden w-5/12 md:block"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-xl text-purple-700 italic">
          Forever and always, it's you and me 💖
          <br />
          (C) Sneha and Amin
        </footer>
      </div>
    </div>
  );
}