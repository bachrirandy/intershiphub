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
  loginWithGoogle: (role: Role) => Promise<User | null>;
  registerWithGoogle: (role: Role) => Promise<User | null>;
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
      addToast('Registrasi berhasil!', 'success');
      return newUser;
  };
  
  const loginWithGoogle = async (role: Role): Promise<User | null> => {
    // This is a dummy implementation. A real one would use a Google Auth library.
    const googleEmail = `dummy.google.${role}@example.com`;
    const foundUser = dummyUsers.find(u => u.email === googleEmail && u.role === role);

    if (foundUser) {
        setUser(foundUser);
        addToast('Login dengan Google berhasil!', 'success');
        return foundUser;
    } else {
        addToast('Akun Google tidak ditemukan. Silakan register terlebih dahulu.', 'error');
        return null;
    }
  };

  const registerWithGoogle = async (role: Role): Promise<User | null> => {
    // This is a dummy implementation.
    const googleEmail = `dummy.google.${role}@example.com`;
    const name = role === Role.STUDENT ? 'Google User' : 'Google Company';
    // The main `register` function already handles checking for existing users and showing appropriate toasts.
    const newUser = await register(name, googleEmail, `googleauth${Date.now()}`, role);
    return newUser;
  };

  const logout = () => {
    setUser(null);
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