import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Role } from '../types';

interface AuthModalConfig {
    mode: 'login' | 'register';
    role: Role;
}

interface ModalContextType {
  isAuthModalOpen: boolean;
  authModalConfig: AuthModalConfig;
  openAuthModal: (config: AuthModalConfig) => void;
  closeAuthModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<AuthModalConfig>({ mode: 'login', role: Role.STUDENT });

  const openAuthModal = useCallback((config: AuthModalConfig) => {
    setAuthModalConfig(config);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ isAuthModalOpen, authModalConfig, openAuthModal, closeAuthModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};