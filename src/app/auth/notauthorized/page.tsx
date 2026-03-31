'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
        
        {/* ILUSTRASI */}
        <Image
          src="/wahyuyu.jpeg"
          alt="wahyu"
          width={700}
          height={500}
          className="mx-auto mb-4 rounded-2xl"
        />

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-black mb-2">
          NO NO YA
        </h1>

        {/* DESKRIPSI */}
        <p className="text-black-300 text-sm mb-6">
          Login dulu mas
        </p>

        {/* BUTTON */}
        <button
          onClick={() => router.push('/auth/login')}
          className="w-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
        >
          Login Sekarang
        </button>

      </div>
    </div>
  );
}