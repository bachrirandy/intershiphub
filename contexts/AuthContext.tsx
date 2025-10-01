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
        ...(role === Role.STUDENT ? { major: 'Belum diisi', skills: [], cvLink: '' } : {}),
        ...(role === Role.COMPANY ? { field: 'Belum diisi', description: '' } : {}),
      };
      dummyUsers.push(newUser);
      setUser(newUser);
      addToast('Registrasi berhasil!', 'success');
      return newUser;
  };
  
  const loginWithGoogle = async (role: Role): Promise<User | null> => {
    let foundUser: User | undefined;
    if (role === Role.STUDENT) {
        foundUser = dummyUsers.find(u => u.email === 'johndoe@email.com');
    } else if (role === Role.COMPANY) {
        foundUser = dummyUsers.find(u => u.email === 'techcorp@email.com');
    }

    if (foundUser) {
        setUser(foundUser);
        addToast('Login dengan Google berhasil!', 'success');
        return foundUser;
    } else {
        addToast('Gagal login dengan Google. Pengguna demo tidak ditemukan.', 'error');
        return null;
    }
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
    <AuthContext.Provider value={{ user, login, register, logout, updateStudentProfile, updateCompanyProfile, loginWithGoogle }}>
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