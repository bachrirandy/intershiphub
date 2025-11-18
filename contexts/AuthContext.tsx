import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '../types';
import { users as dummyUsers } from '../data/dummyData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<User | null>;
  register: (name: string, email: string, password: string, role: Role) => Promise<User | null>;
  logout: () => void;
  updateStudentProfile: (profile: Partial<User>) => void;
  updateCompanyProfile: (profile: Partial<User>) => void;
  loginWithGoogle: (role: Role, email?: string) => Promise<User | null>;
  registerWithGoogle: (role: Role, email?: string, name?: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { addToast } = useToast();

  const login = async (email: string, password: string, role: Role): Promise<User | null> => {
    const foundUser = dummyUsers.find(u => u.email === email && u.role === role && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      addToast('Login berhasil!', 'success');
      return foundUser;
    } else {
      addToast('Email atau password salah.', 'error');
      return null;
    }
  };

  const register = async (name: string, email: string, password: string, role: Role): Promise<User | null> => {
      const existingUser = dummyUsers.find(u => u.email === email);
      if (existingUser) {
          addToast('Email sudah terdaftar.', 'error');
          return null;
      }
      
      const newUser: User = {
        id: dummyUsers.length + 1,
        name,
        email,
        password,
        role,
        ...(role === Role.STUDENT ? {
            major: '',
            skills: [],
            cvLink: '',
            university: '',
            graduationYear: new Date().getFullYear() + 4,
            bio: '',
            portfolioLink: '',
            linkedinProfile: '',
            profilePictureUrl: ''
        } : {}),
        ...(role === Role.COMPANY ? {
            field: '',
            description: '',
            logoUrl: '',
            website: '',
            location: '',
            companySize: '1-10 Karyawan',
            techStack: []
        } : {}),
      };
      dummyUsers.push(newUser);
      setUser(newUser);
      addToast('Registrasi berhasil! Selamat datang.', 'success');
      return newUser;
  };
  
  const loginWithGoogle = async (role: Role, email?: string): Promise<User | null> => {
    // Simulated Google Auth
    // If email is provided (from the simulation modal), try to find that user.
    // Otherwise fallback to a demo behavior (though UI should now prevent this).
    const targetEmail = email; 
    
    if (!targetEmail) {
         addToast('Silakan masukkan email Google Anda.', 'error');
         return null;
    }

    const foundUser = dummyUsers.find(u => u.email === targetEmail && u.role === role);

    if (foundUser) {
        setUser(foundUser);
        addToast(`Login Google berhasil! Selamat datang, ${foundUser.name}.`, 'success');
        return foundUser;
    } else {
        addToast('Akun Google tidak ditemukan. Silakan register terlebih dahulu.', 'error');
        return null;
    }
  };

  const registerWithGoogle = async (role: Role, email?: string, name?: string): Promise<User | null> => {
    const targetEmail = email;
    const targetName = name || (role === Role.STUDENT ? 'Pengguna Google' : 'Perusahaan Google');

    if (!targetEmail) {
        addToast('Silakan lengkapi data Google Anda.', 'error');
        return null;
    }

    // The main `register` function already handles checking for existing users and showing appropriate toasts.
    // We use a dummy password for OAuth users internally
    const newUser = await register(targetName, targetEmail, `google-oauth-${Date.now()}`, role);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    addToast('Anda telah logout.', 'info');
  };

  const updateStudentProfile = (profile: Partial<User>) => {
    if(user && user.role === Role.STUDENT) {
        const updatedUser = { ...user, ...profile };
        setUser(updatedUser);
        const userIndex = dummyUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            dummyUsers[userIndex] = updatedUser;
        }
    }
  };

  const updateCompanyProfile = (profile: Partial<User>) => {
    if(user && user.role === Role.COMPANY) {
        const updatedUser = { ...user, ...profile };
        setUser(updatedUser);
        const userIndex = dummyUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            dummyUsers[userIndex] = updatedUser;
        }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateStudentProfile, updateCompanyProfile, loginWithGoogle, registerWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};