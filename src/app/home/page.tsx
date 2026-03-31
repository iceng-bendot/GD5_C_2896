'use client';

import React, { useEffect, useState } from "react";
import Game1 from "../../components/Game1";
import Game2 from "../../components/Game2";
import { useRouter } from 'next/navigation';
import { FaPowerOff } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLogin = localStorage.getItem('isLogin');

    if (!isLogin) {
      router.replace('/auth/notauthorized');
    } else {
      setIsReady(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    router.push('/auth/login');
  };

  if (!isReady) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-blue-100/10 px-50 rounded-2xl">
        <h1 className="text-4xl font-bold mb-6 mt-2">Selamat Datang!</h1>
      
      <h1 className="text-4xl font-bold mb-5">
        {selectedGame === null && "Mau main apa hari ini bos?"}
        {selectedGame === 1 && ""}
        {selectedGame === 2 && ""}
      </h1>


      {selectedGame === null && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 
        h-[150px] rounded-2xl flex items-center justify-center 
        border border-white/10 shadow-inner relative overflow-hidden p-10 gap-5">

          <button
            onClick={() => setSelectedGame(1)}
            className="px-8 py-4 rounded-xl font-bold text-lg text-white 
             bg-blue-600 border-2 border-blue-300
             hover:bg-blue-700 hover:border-white
             shadow-[0_0_15px_rgba(59,130,246,0.8)]
             transition-all duration-200"
          >
            🎮 Main Game 1
          </button>

          <button
            onClick={() => setSelectedGame(2)}
            className="px-8 py-4 rounded-xl font-bold text-lg text-white 
             bg-green-600 border-2 border-green-300
             hover:bg-green-700 hover:border-white
             shadow-[0_0_15px_rgba(34,197,94,0.8)]
             transition-all duration-200"
          >
            🚀 Main Game 2
          </button>


        </div>
      )}

        <button
        onClick={handleLogout}
        className="mt-5 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg transition flex items-center flex-col"
        >
        <FaPowerOff size={30} />Logout
        </button>

      {selectedGame === 1 && (
        <div className="flex flex-col items-center">
          <Game1 />

          <button
            onClick={() => setSelectedGame(null)}
            className="bg-gray-500 hover:bg-gray-600 px-4 py-2 mt-10 mb-10 rounded transition"
          >
            ⬅ Kembali ke Menu
          </button>
        </div>
      )}

      {/* 🔥 GAME 2 */}
      {selectedGame === 2 && (
        <div className="flex flex-col items-center mt-5">
          <Game2 />

          <button
            onClick={() => setSelectedGame(null)}
            className="mt-5 mb-5 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded transition"
          >
            ⬅ Kembali ke Menu
          </button>
        </div>
      )}

    </div>
  );
}