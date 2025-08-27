
import React from 'react';
import { AdminIcon, InstagramIcon, FacebookIcon, WhatsAppIconLine } from './icons';

interface FooterProps {
  isAdmin: boolean;
  onNavigateToAdmin: () => void;
  onNavigateToHome: () => void;
  onNavigateToShop: () => void;
  onNavigateToQuiz: () => void;
  onNavigateToBestSellers: () => void;
}

const instagramImages = [
    'https://belcorpcolombia.vtexassets.com/arquivos/ids/1010677-1600-auto?v=638912161969070000&width=1600&height=auto&aspect=true',
    'https://belcorpcolombia.vtexassets.com/arquivos/ids/1015606-1600-auto?v=638912265768570000&width=1600&height=auto&aspect=true',
    'https://lbelcolombia.vtexassets.com/arquivos/ids/1010612-1600-auto?v=638912160612570000&width=1600&height=auto&aspect=true',
    'https://belcorpcolombia.vtexassets.com/arquivos/ids/1030242-1600-auto?v=638917446143700000&width=1600&height=auto&aspect=true',
    'https://belcorpcolombia.vtexassets.com/arquivos/ids/1015432-1600-auto?v=638912262261630000&width=1600&height=auto&aspect=true',
    'https://belcorpcolombia.vtexassets.com/arquivos/ids/1015667-1600-auto?v=638912267316730000&width=1600&height=auto&aspect=true',
];

const FooterLink: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <li>
        <button onClick={onClick} className="hover:text-[#DAB162] transition-colors text-left w-full">
            {children}
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ isAdmin, onNavigateToAdmin, onNavigateToHome, onNavigateToShop, onNavigateToQuiz, onNavigateToBestSellers }) => {
  return (
    <footer className="bg-[#1c3a4a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navegación */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Navegación</h3>
            <ul className="space-y-2">
              <FooterLink onClick={onNavigateToHome}>Inicio</FooterLink>
              <FooterLink onClick={onNavigateToShop}>Tienda</FooterLink>
              <FooterLink onClick={onNavigateToQuiz}>Descubre tu Aroma</FooterLink>
              <FooterLink onClick={onNavigateToBestSellers}>Más Vendidos</FooterLink>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <FooterLink>Preguntas Frecuentes</FooterLink>
              <FooterLink>Envíos y Devoluciones</FooterLink>
              <FooterLink>Contacto</FooterLink>
              <FooterLink>Estado del Pedido</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink>Términos y Condiciones</FooterLink>
              <FooterLink>Política de Privacidad</FooterLink>
              <FooterLink>Política de Cookies</FooterLink>
            </ul>
          </div>

          {/* Conexión */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="font-bold text-lg text-white mb-4">Síguenos en Tiempo Real</h3>
            <div className="grid grid-cols-3 gap-2">
                {instagramImages.map((src, index) => (
                    <a 
                        key={index}
                        href="https://www.instagram.com/_scentmart"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group overflow-hidden rounded-md aspect-square block"
                    >
                        <img src={src} alt={`Instagram post ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <InstagramIcon className="text-white h-8 w-8 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300"/>
                        </div>
                    </a>
                ))}
            </div>
            <a
                href="https://www.instagram.com/_scentmart"
                target="_blank"
                rel="noopener noreferrer" 
                className="block w-full text-center mt-4 px-6 py-2 bg-transparent border border-[#DAB162] text-[#DAB162] font-bold rounded-full shadow-lg hover:bg-[#DAB162]/20 transition-colors"
            >
                Seguir en Instagram
            </a>
            <div className="flex justify-center items-center gap-6 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#DAB162] transition-colors"><FacebookIcon className="h-6 w-6"/></a>
                <a href="https://wa.me/573213200601" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#DAB162] transition-colors"><WhatsAppIconLine className="h-6 w-6"/></a>
            </div>
          </div>
        </div>
        
        {/* Sub-footer */}
        <div className="border-t border-[#3a6a82] py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} ScentMart Perfumes. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center">
                <button 
                    onClick={onNavigateToAdmin} 
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isAdmin ? 'text-red-500' : 'text-gray-400'}`}
                    title="Modo Administrador"
                >
                    <AdminIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
      </div>
    </footer>
  );
};
