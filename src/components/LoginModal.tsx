import React, { useState } from 'react';
import { XMarkIcon, UserIcon, LockClosedIcon } from './icons';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: string, pass: string) => boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = onLogin(username, password);
    if (!success) {
      setError('Usuario o clave incorrectos.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-[#224859] border border-[#3a6a82] rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-95 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <XMarkIcon className="h-8 w-8" />
        </button>

        <div className="p-8 sm:p-12">
          <h2 className="font-serif-display text-3xl font-bold text-center text-[#DAB162]">Acceso Administrador</h2>
          <p className="text-center text-gray-300 mt-2">Ingresa tus credenciales para continuar.</p>
          <p className="text-center text-gray-400 text-sm mt-2">(Pista: el usuario es 'admin' y la clave '1234')</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="username" className="text-sm font-bold text-[#DAB162]">Usuario</label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 pl-10 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password"className="text-sm font-bold text-[#DAB162]">Clave</label>
               <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            
            <div>
              <button
                type="submit"
                className="w-full mt-4 px-10 py-3 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};