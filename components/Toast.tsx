
import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastContext';

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

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
  
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div
      className={`
        ${bgColor} text-white px-6 py-4 rounded-md shadow-lg flex items-center
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;
