import React, { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed top-28 right-4 z-50 ${bgColor} text-white py-3 px-6 rounded-lg shadow-lg animate-slide-in-right`}>
      <p>{message}</p>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};