import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { useModal } from '../contexts/ModalContext';
import { useToast } from '../contexts/ToastContext';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  initialRole?: Role;
}

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.3 512 0 398.5 0 256S111.3 0 244 0c69.9 0 131.5 28.2 176.2 72.9l-63.1 61.3C333.1 102.4 291.1 84 244 84c-86 0-156 67.9-156 151.4s70 151.4 156 151.4c93.1 0 128.5-61.2 133.7-95.2H244v-76.3h239.1c4.7 25.4 7.3 51.1 7.3 78.4z"></path>
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login', initialRole = Role.STUDENT }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, loginWithGoogle } = useAuth();
  const { closeAuthModal } = useModal();
  const { addToast } = useToast();

  // FIX: This effect syncs the component's internal state with the props.
  // This is necessary because the component doesn't unmount, so useState's
  // initial value is only used once. This ensures that if the modal is
  // re-opened with a different configuration, the UI reflects it correctly.
  useEffect(() => {
    setMode(initialMode);
    setRole(initialRole);
  }, [initialMode, initialRole]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && password !== confirmPassword) {
      addToast('Password tidak cocok.', 'error');
      return;
    }

    if (mode === 'login') {
      login(email, password, role);
    } else {
      register(name, email, password, role);
    }
    
    // The global logic in App.tsx will handle redirection after successful login/registration.
    // We just close the modal here. The user state change will trigger the redirect.
    closeAuthModal();
  };

  const handleGoogleLogin = () => {
    loginWithGoogle(role);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
        </h2>
        <p className="text-center text-gray-500 mb-6">{mode === 'login' ? 'Login untuk melanjutkan' : 'Daftar sebagai'}</p>

        <div className="flex justify-center mb-6 border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setRole(Role.STUDENT)}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors ${role === Role.STUDENT ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Mahasiswa
          </button>
          <button
            onClick={() => setRole(Role.COMPANY)}
            className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors ${role === Role.COMPANY ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Perusahaan
          </button>
        </div>
        
        <div className="space-y-4">
            <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <GoogleIcon />
                <span>{mode === 'login' ? 'Login dengan Google' : 'Daftar dengan Google'}</span>
            </button>

            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>
        </div>


        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nama {role === Role.STUDENT ? 'Lengkap' : 'Perusahaan'}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
            />
          </div>
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                  Konfirmasi Password
              </label>
              <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;