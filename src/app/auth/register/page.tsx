'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';

type RegisterFormData = {
  username: string;
  email: string;
  nomorHp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const RegisterPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const [captcha, setCaptcha] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const resetCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok', { theme: 'dark' });
      return;
    }

    if (data.captcha !== captcha) {
      toast.error('Captcha salah', { theme: 'dark',
        position: 'top-right'
       });
      return;
    }

    toast.success('Register Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/auth/login');
  };

  const getPasswordStrength = (password: string) => {
    return Math.min(
      100,
      (password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(password) ? 25 : 0) +
      (/[0-9]/.test(password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
    );
  };

  const strength = getPasswordStrength(password)

  const confirmStrength =
    confirmPassword && confirmPassword === password ? strength : 0;

  const getStrengthColor = (score: number) => {
    if (score <= 25) return 'red';
    if (score <= 50) return 'orange';
    if (score <= 75) return 'green';
    return 'green';
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <AuthFromWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username <span className="text-gray-700">(max 8 karakter)</span>
          </label>
          <input
            id="username"
            {...register('username', { required: 'Username wajib diisi',
              minLength: {
                value: 3,
                message: 'Username minimal 3 karakter'
              },
              maxLength: {
                value: 8,
                message: 'Username maksimal 8 karakter'
              }
             })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan username"
          />
          {errors.username && (
            <p className="text-red-600 text-sm italic">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email 
          </label>
          <input
            type="email"
            {...register('email', { required: 'Email wajib diisi',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.(com|net|co)$/,
                message: 'Format email tidak valid',
              },
             })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm italic">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="tel"
            {...register('nomorHp', { required: 'Nomor telepon wajib diisi',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Nomor hanya boleh angka',
              },
              minLength: {
                value: 10,
                message: 'Nomor telepon minimal 10 karakter',
              },
             })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.nomorHp ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorHp && (
            <p className="text-red-600 text-sm italic">{errors.nomorHp.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type= {showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password wajib diisi',
                minLength: {
                  value: 8,
                  message: 'Password minimal 8 karakter',
                },
              })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-600 text-sm italic">{errors.password.message}</p>
          )}

          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="h-2 rounded transition-all"
              style={{
                width: `${strength}%`,
                backgroundColor: getStrengthColor(strength),
              }}
            />
          </div>
          <p className="text-sm text-gray-500">
            Strength: {strength}%
          </p>
        </div>


        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Konfirmasi password wajib diisi',
                validate: (value) =>
                  value === password || 'Konfirmasi password tidak cocok',  
              })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan ulang password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm italic">{errors.confirmPassword.message}</p>
          )}
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="h-2 rounded transition-all"
              style={{
                width: `${confirmStrength}%`,
                backgroundColor: getStrengthColor(confirmStrength),
              }}
            />
          </div>
          <p className="text-sm text-gray-500">
            Strength: {strength}%
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
              {captcha}
            </span>

            <button
              type="button"
              onClick={resetCaptcha}
              className="text-gray-600 hover:text-blue-600"
            >
              <FiRefreshCw />
            </button>
          </div>
          <input
            type="text"
            {...register('captcha', { required: 'Harus sesuai dengan captcha yang ditampilkan' })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.captcha ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && (
            <p className="text-red-600 text-sm italic">{errors.captcha.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg"
        >
          Register
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Login
          </Link>
        </p>

      </form>
    </AuthFromWrapper>
  );
};

export default RegisterPage;