import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const Toast: React.FC<ToastProps> = ({ id, message, type }) => {
  const { removeToast } = useToast();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => removeToast(id), 300); // Wait for fade-out
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, removeToast]);
  
  const config = {
    success: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: <SuccessIcon /> },
    error: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: <ErrorIcon /> },
    info: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: <InfoIcon /> },
  }[type];

  return (
    <div
      className={`
        ${config.bg} ${config.text} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 border
        transition-all duration-300 ease-in-out transform
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <div>{config.icon}</div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

export default Toast;