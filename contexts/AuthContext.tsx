import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, Role } from '../types';
import { users as dummyUsers } from '../data/dummyData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => void;
  register: (name: string, email: string, password: string, role: Role) => void;
  logout: () => void;
  updateStudentProfile: (profile: Partial<User>) => void;
  updateCompanyProfile: (profile: Partial<User>) => void;
  loginWithGoogle: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { addToast } = useToast();

  const login = useCallback((email: string, password: string, role: Role) => {
    const foundUser = dummyUsers.find(u => u.email === email && u.role === role && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      addToast('Login berhasil!', 'success');
    } else {
      addToast('Email atau password salah.', 'error');
    }
  }, [addToast]);

  const register = useCallback((name: string, email: string, password: string, role: Role) => {
      const existingUser = dummyUsers.find(u => u.email === email);
      if (existingUser) {
          addToast('Email sudah terdaftar.', 'error');
          return;
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
  }, [addToast]);
  
  const loginWithGoogle = useCallback((role: Role) => {
    // This is a simulation. In a real app, this would involve a popup,
    // a redirect to Google, and handling the callback.
    // Here, we'll just log in a predefined user based on the role.
    let foundUser: User | undefined;
    if (role === Role.STUDENT) {
        // Log in a default student user for the demo
        foundUser = dummyUsers.find(u => u.email === 'johndoe@email.com');
    } else if (role === Role.COMPANY) {
        // Log in a default company user for the demo
        foundUser = dummyUsers.find(u => u.email === 'techcorp@email.com');
    }

    if (foundUser) {
        setUser(foundUser);
        addToast('Login dengan Google berhasil!', 'success');
    } else {
        // This case shouldn't happen with dummy data, but it's good practice.
        addToast('Gagal login dengan Google. Pengguna demo tidak ditemukan.', 'error');
    }
  }, [addToast]);

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