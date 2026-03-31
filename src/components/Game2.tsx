'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'

type Item = {
  id: number;
  type: 'coin' | 'bomb';
  top: number;
  left: number;
};

export default function Game2() {
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explosion, setExplosion] = useState<{ top: number; left: number } | null>(null);

  // start game
  const startGame = () => {
    setScore(0);
    setTime(60);
    setItems([]);
    setIsPlaying(true);

    toast.info("🚀 Game dimulai! Awas bomb 💣", {
      position: 'top-right',
      theme: 'dark'
    });
  };

  // timer game
  useEffect(() => {
    if (!isPlaying) return;

    if (time === 0) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, isPlaying]);

  // spawn koin sama bomb nya secara random
  useEffect(() => {
    if (!isPlaying) return;

    // ngeluarin item tiap 0,8 detik
    const interval = setInterval(() => {
      const isBomb = Math.random() < 0.3;

      const newItem: Item = {
        id: Date.now(),
        type: isBomb ? 'bomb' : 'coin',
        top: Math.random() * 80,
        left: Math.random() * 80,
      };

      setItems((prev) => [...prev, newItem]);

      // hapus otomatis setelah 1,5 detik
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== newItem.id));
      }, 1500);
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // klik an nya
  const handleClick = (item: Item) => {
    if (item.type === 'bomb') {
      // munculin efek ledakan
      setExplosion({ top: item.top, left: item.left });

      toast.error("Hahahay kamu kena bom", {
        position: 'top-right',
        theme: 'dark'
      });
      // delay sebelum game over
      setTimeout(() => {
        setExplosion(null);
        setIsPlaying(false);
      }, 500);

      return;
    }

    setScore((prev) => prev + 1);
    setItems((prev) => prev.filter((i) => i.id !== item.id)); //hapus koin setelah selesai
  };

  // kalo selesai, notif waktu habis
  useEffect(() => {
    if (time === 0 && isPlaying) {
      setIsPlaying(false);

      toast.info("⏰ Waktu habis!", {
        position: 'top-right',
        theme: 'dark'
      });
    }
  }, [time, isPlaying]);

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 p-4 rounded-3xl">

      <div className="w-full max-w-4xl 
        bg-gradient-to-br from-purple-500/80 to-indigo-600/80 
        backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] 
        border border-white/20 text-white">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold drop-shadow-lg">
            💣 Don't Click The Bomb
          </h1>
          <p className="text-white/80 mt-2">
            Awas ada bom 💣 
          </p>
        </div>

        <hr className="border-white/20 mb-6" />

        <div className="flex justify-between items-center 
          bg-white/10 backdrop-blur-md p-4 rounded-xl mb-6 shadow-inner">
          <span>🏆 Score: {score}</span>
          <span>⏱️ Time: {time}</span>
        </div>

        {/* area game */}
        <div className="relative h-[400px] 
          bg-gradient-to-br from-slate-800 to-slate-900 
          rounded-2xl border border-white/10 shadow-inner overflow-hidden">

          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={`absolute text-4xl cursor-pointer 
                hover:scale-125 active:scale-95 transition
                ${item.type === 'coin'
                  ? 'drop-shadow-[0_0_10px_gold]'
                  : 'drop-shadow-[0_0_10px_red]'}`}
              style={{
                top: `${item.top}%`,
                left: `${item.left}%`,
              }}
            >
              {item.type === 'coin' ? '🪙' : '💣'}
            </div>
          ))}

          {/* efek ada ledakan saat nyentuh bom */}
          {explosion && (
            <div
              className="absolute text-6xl animate-ping drop-shadow-[0_0_20px_red]"
              style={{
                top: `${explosion.top}%`,
                left: `${explosion.left}%`,
              }}
            >
              💥
            </div>
          )}

          {/* detail layar nyala dikit */}
          {explosion && (
            <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none" />
          )}

        </div>

        <div className="mt-6 flex flex-col items-center gap-4">

          {!isPlaying ? (
            <button
              onClick={startGame}
              className="w-full max-w-md 
              bg-gradient-to-r from-green-400 to-green-600 
              py-3 rounded-xl font-bold text-lg 
              hover:scale-105 transition">
              🚀 Start Game
            </button>
          ) : (
            <p className="text-white/70">Game sedang berjalan...</p>
          )}

        </div>

      </div>
    </div>
  );
}