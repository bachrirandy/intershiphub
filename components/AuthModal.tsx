import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CheckIcon = () => <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;
const XIcon = () => <svg className="w-4 h-4 text-slate-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

const PasswordReq: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className={`flex items-center text-xs ${met ? 'text-green-600 font-bold' : 'text-slate-400'}`}>
      {met ? <CheckIcon /> : <XIcon />}
      {text}
  </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ initialMode = 'login', initialRole = Role.STUDENT }) => {
  const [view, setView] = useState<'main' | 'google'>('main');
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Google Simulation State
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const { login, register, loginWithGoogle, registerWithGoogle } = useAuth();
  const { closeAuthModal } = useModal();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
    setRole(initialRole);
    setErrors({});
    setView('main');
    setGoogleEmail('');
    setGoogleName('');
  }, [initialMode, initialRole]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'register') {
      if (!name) newErrors.name = 'Nama tidak boleh kosong.';
      else if (name.length < 2) newErrors.name = 'Nama minimal 2 karakter.';

      if (!email) newErrors.email = 'Email tidak boleh kosong.';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid.';

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!password) {
        newErrors.password = 'Password tidak boleh kosong.';
      } else if (!passwordRegex.test(password)) {
        newErrors.password = 'Password belum memenuhi syarat.';
      }

      if (password !== confirmPassword) newErrors.confirmPassword = 'Password tidak cocok.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleNavigation = (userRole: Role) => {
    switch (userRole) {
        case Role.STUDENT: navigate('/student'); break;
        case Role.COMPANY: navigate('/company'); break;
        case Role.ADMIN: navigate('/admin'); break;
        default: navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && !validate()) return;

    let loggedInUser;
    if (mode === 'login') {
      loggedInUser = await login(email, password, role);
    } else {
      loggedInUser = await register(name, email, password, role);
    }
    
    if (loggedInUser) {
        handleNavigation(loggedInUser.role);
        closeAuthModal();
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let user;
      if (mode === 'login') {
          user = await loginWithGoogle(role, googleEmail);
      } else {
          user = await registerWithGoogle(role, googleEmail, googleName);
      }

      if (user) {
          handleNavigation(user.role);
          closeAuthModal();
      }
  };
  
  const getInputStyle = (field: string) => `w-full px-4 py-3 rounded-lg bg-slate-50 border focus:bg-white transition-colors outline-none ${errors[field] ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'}`;

  const passwordRequirements = [
      { id: 1, text: "8+ Karakter", met: password.length >= 8 },
      { id: 2, text: "Huruf Besar", met: /[A-Z]/.test(password) },
      { id: 3, text: "Angka", met: /\d/.test(password) },
      { id: 4, text: "Simbol", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={closeAuthModal}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative flex overflow-hidden animate-scale-in max-h-[90vh]">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-slate-500 hover:text-red-500 transition-all shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 overflow-y-auto">
             {view === 'main' && (
                <>
                    <div className="mb-8">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-2">
                            {mode === 'login' ? 'Selamat Datang' : 'Mulai Perjalananmu'}
                        </h2>
                        <p className="text-slate-500">
                            {mode === 'login' ? 'Masuk untuk mengakses dashboard Anda.' : 'Buat akun baru dalam hitungan detik.'}
                        </p>
                    </div>

                    <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
                        <button onClick={() => setRole(Role.STUDENT)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === Role.STUDENT ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            Mahasiswa
                        </button>
                        <button onClick={() => setRole(Role.COMPANY)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${role === Role.COMPANY ? 'bg-white text-brand-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            Perusahaan
                        </button>
                    </div>
                    
                    <button onClick={() => setView('google')} className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors mb-6 group">
                        <GoogleIcon />
                        <span className="font-medium text-slate-700 group-hover:text-slate-900">{mode === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}</span>
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-medium tracking-wider">atau email</span></div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama {role === Role.STUDENT ? 'Lengkap' : 'Perusahaan'}</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={getInputStyle('name')} placeholder="Contoh: Budi Santoso" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                        )}
                        <div>
                             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={getInputStyle('email')} placeholder="nama@email.com" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={getInputStyle('password')} placeholder="••••••••" />
                            {mode === 'register' && (
                                <div className="mt-2 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {passwordRequirements.map(req => <PasswordReq key={req.id} met={req.met} text={req.text} />)}
                                </div>
                            )}
                             {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        {mode === 'register' && (
                            <div>
                                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={getInputStyle('confirmPassword')} placeholder="••••••••" />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                        )}
                        
                        <button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 mt-2">
                            {mode === 'login' ? 'Masuk Akun' : 'Buat Akun Gratis'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
                            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-bold text-brand-primary hover:text-brand-dark hover:underline transition-colors">
                                {mode === 'login' ? 'Daftar Sekarang' : 'Login disini'}
                            </button>
                        </p>
                    </div>
                </>
             )}

             {/* Simulated Google View */}
             {view === 'google' && (
                <div className="animate-fade-in h-full flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                             <GoogleIcon />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Simulasi Google Auth</h3>
                        <p className="text-slate-500 text-sm mt-2">Pilih akun untuk melanjutkan ke InternshipHub</p>
                    </div>
                    <form onSubmit={handleGoogleSubmit} className="space-y-5">
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Google</label>
                            <input type="email" value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)} className={getInputStyle('googleEmail')} placeholder="user@gmail.com" autoFocus required />
                        </div>
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Tampilan</label>
                                <input type="text" value={googleName} onChange={(e) => setGoogleName(e.target.value)} className={getInputStyle('googleName')} placeholder={role === Role.STUDENT ? "Nama Lengkap" : "Nama Perusahaan"} required />
                            </div>
                        )}
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setView('main')} className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Batal</button>
                            <button type="submit" className="flex-1 bg-brand-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-brand-dark">Lanjutkan</button>
                        </div>
                    </form>
                </div>
             )}
        </div>

        {/* Right Side - Creative Visual */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-purple relative items-center justify-center p-12 text-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-accent rounded-full blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-purple rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10 max-w-md text-center">
                <div className="mb-8 inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="text-4xl">🚀</div>
                </div>
                <h3 className="text-3xl font-heading font-bold mb-4 leading-tight">
                    "Platform terbaik untuk memulai karir impianmu."
                </h3>
                <p className="text-brand-light text-lg mb-8 font-light">
                    Bergabung dengan 10,000+ mahasiswa dan 500+ perusahaan top di Indonesia.
                </p>
                
                <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;