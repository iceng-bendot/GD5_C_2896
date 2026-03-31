"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Game1() {
  const holes = Array.from({ length: 9 });

  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(30);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("whack_highscore");
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (!gameActive) return;

    const moleTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * holes.length);
      setMoleIndex(randomIndex);
    }, 700);

    return () => clearInterval(moleTimer);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const countdown = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameActive]);

  useEffect(() => {
    if (time === 0 && gameActive) {
      setGameActive(false);

      toast.info("⏰ Waktu habis!");

      if (score > highScore) {
        localStorage.setItem("whack_highscore", score.toString());
        setHighScore(score);
        toast.success("🎉 New High Score!");
      }
    }
  }, [time, gameActive]);

  const hitMole = (index: number) => {
    if (index === moleIndex && gameActive) {
      setScore((prev) => prev + 1);
      setMoleIndex(null);
    }
  };

  const startGame = () => {
    setScore(0);
    setTime(30);
    setGameActive(true);

    toast.info("⏱️ Game dimulai!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600 p-4 mt-5">

      {/* 🎮 MAIN CARD */}
      <div className="w-full max-w-4xl 
        bg-gradient-to-br from-orange-500/80 to-amber-600/80 
        backdrop-blur-xl p-6 rounded-3xl 
        shadow-[0_20px_60px_rgba(0,0,0,0.5)] 
        border border-white/20 text-white">

        {/* 🔥 HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold drop-shadow-lg">
            🐹 Tap the Mouse
          </h1>
          <p className="text-white/80 mt-2">
            Klik tikus secepat mungkin sebelum waktu habis!
          </p>
        </div>

        <hr className="border-white/20 mb-6" />

        {/* 📊 INFO */}
        <div className="flex justify-between items-center 
          bg-white/10 backdrop-blur-md p-4 rounded-xl mb-6 shadow-inner">

          <span>🏆 Score: {score}</span>
          <span>⏱️ Time: {time}</span>
          <span>⭐ High: {highScore}</span>

        </div>

        {/* 🎮 GAME AREA */}
        <div className="grid grid-cols-3 gap-4 
          bg-gradient-to-br from-slate-800 to-slate-900 
          p-6 rounded-2xl border border-white/10 shadow-inner">

          {holes.map((_, index) => (
            <div
              key={index}
              onClick={() => hitMole(index)}
              className="bg-black/40 h-20 rounded-xl flex items-center justify-center 
                cursor-pointer hover:scale-105 active:scale-95 transition"
            >
              {moleIndex === index && (
                <div className="text-4xl animate-bounce">
                  🐹
                </div>
              )}
            </div>
          ))}

        </div>

        {/* 🎯 BUTTON */}
        <div className="mt-6 flex flex-col items-center gap-4">

          {!gameActive && (
            <button
              onClick={startGame}
              className="w-full max-w-md 
              bg-gradient-to-r from-yellow-400 to-orange-500 
              py-3 rounded-xl font-bold text-lg 
              hover:scale-105 active:scale-95 
              transition-all duration-200">
              🚀 Start Game
            </button>
          )}

        </div>

      </div>
    </div>
  );
}