'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiRefreshCw } from 'react-icons/fi';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LoginPage = () => {
  const router = useRouter();

  const [loginAttempts, setLoginAttempts] = useState(3);

  const [captcha, setCaptcha] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
  });

  const [errors, setErrors] = useState<ErrorObject>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData((prev) => ({ ...prev, captchaInput: '' }));
  };

  const validateNPM = () => {
    const emailRegex = /^(\d{4})@gmail\.com$/;
    const match = formData.email.match(emailRegex);

    if (!match) return false;

    const first4 = match[1]; // 4 digit email
    const password = formData.password;

    // password harus 9 digit dan 4 digit terakhir = first4
    const passwordRegex = new RegExp(`^\\d{5}${first4}$`);

    return passwordRegex.test(password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  if (loginAttempts === 0) {
    toast.error('Kesempatan login habis!', {
      position: 'top-right',
      theme: 'dark',
    });
    return;
  }

  const newErrors: ErrorObject = {};

  // VALIDASII
  if (!formData.email.trim()) {
    newErrors.email = 'Email tidak boleh kosong';
  } else if (!/^(\d{4})@gmail\.com$/.test(formData.email)) {
    newErrors.email =
      'Email harus sesuai dengan npm kalian (cth. 1905@gmail.com)';
  }

  if (!formData.password.trim()) {
    newErrors.password = 'Password tidak boleh kosong';
  } else if (formData.email.trim()) {
    if (!validateNPM()) {
      newErrors.password = 
      'Password harus sesuai dengan npm kalian (cth. 220711905)'
    }
  }

  // CAPTCHA
  if (!formData.captchaInput.trim()) {
    newErrors.captcha = 'Captcha belum diisi';
  } else if (formData.captchaInput !== captcha) {
    newErrors.captcha = 'Captcha salah';
  }

  // HANDLE ERROR
if (Object.keys(newErrors).length > 0) {
  setErrors(newErrors);

  const attempts = loginAttempts - 1;
  setLoginAttempts(attempts);

  if (attempts === 0) {
    toast.error('Kesempatan login habis!', {
      position: 'top-right',
      theme: 'dark',
    });
  } else {
    toast.error(`Login Gagal! Sisa kesempatan: ${attempts}`, {
      position: 'top-right',
      theme: 'dark',
    });
  }

  return;
}

  localStorage.setItem('isLogin', 'true');
  localStorage.setItem('loginSuccess', 'true');
  // SUCCESS
  toast.success('Login Berhasil!', {
    position: 'top-right',
    theme: 'dark',
  });

  router.push('/home')
};

  const resetAttempts = () => {
    setLoginAttempts(3);
    setErrors({});

    toast.success(`Kesempatan login berhasil direset!`, {
      position: 'top-right',
      theme: 'dark'
    }
    )
  };

  return (
    <AuthFromWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-5 w-full">


        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukan email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm italic">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukan password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm italic">{errors.password}</p>
          )}
        </div>

        {/* CAPTCHA */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Captcha:</span>
            <span className="font-mono text-lg font-bold bg-gray-100 px-3 py-1.5 rounded">
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
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.captcha ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukan captcha"
          />

          {errors.captcha && (
            <p className="text-red-600 text-sm italic">{errors.captcha}</p>
          )}
        </div>

        {/* Kesempatan Login */}
        <p className="text-sm text-gray-600">
          <b>Kesempatan Login Tersisa: {loginAttempts}</b>
        </p>
        {/* SIGN IN */}
        <button
          type="submit"
          disabled={loginAttempts === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg disabled:bg-gray-400"
        >
          <b>Sign In</b>
        </button>

        {/* RESET BUTTON */}
        <button
          type="button"
          onClick={resetAttempts}
          disabled={loginAttempts > 0}
          className="w-full bg-green-600 hover:bg-gray-700 text-white py-2.5 rounded-lg disabled:bg-gray-400"
        >
          <b>Reset Kesempatan Login</b>
        </button>

        <SocialAuth />

        <p className="text-center text-sm">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;

