import React, { useState } from 'react';
import { CubeIcon, Cog6ToothIcon, HomeIcon, ArrowUturnLeftIcon, ShareIcon } from '../icons';

interface AdminSidebarProps {
    onNavigate: (view: 'catalog' | 'brand_identity' | 'integrations') => void;
    onExit: () => void;
    onLogout: () => void;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive: boolean;
}> = ({ icon, label, onClick, isActive }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            isActive ? 'bg-[#DAB162] text-[#1c3a4a] font-bold' : 'text-gray-300 hover:bg-[#2a556a] hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate, onExit, onLogout }) => {
    const [activeView, setActiveView] = useState<'catalog' | 'brand_identity' | 'integrations'>('catalog');

    const handleNavigation = (view: 'catalog' | 'brand_identity' | 'integrations') => {
        setActiveView(view);
        onNavigate(view);
    };

    return (
        <aside className="w-64 bg-[#224859] text-white p-4 flex flex-col border-r border-[#3a6a82]">
            <div className="mb-8 text-center">
                 <h1 className="text-2xl font-serif-display font-bold text-[#DAB162]">ScentMart</h1>
                 <p className="text-sm text-gray-400">Panel de Administración</p>
            </div>
            <nav className="flex-1 space-y-2">
                <NavLink 
                    icon={<CubeIcon className="h-6 w-6" />}
                    label="Productos"
                    onClick={() => handleNavigation('catalog')}
                    isActive={activeView === 'catalog'}
                />
                <NavLink 
                    icon={<ShareIcon className="h-6 w-6" />}
                    label="Integraciones"
                    onClick={() => handleNavigation('integrations')}
                    isActive={activeView === 'integrations'}
                />
                <NavLink 
                    icon={<Cog6ToothIcon className="h-6 w-6" />}
                    label="Configuración"
                    onClick={() => handleNavigation('brand_identity')}
                    isActive={activeView === 'brand_identity'}
                />
            </nav>
            <div className="mt-auto space-y-2">
                 <NavLink 
                    icon={<HomeIcon className="h-6 w-6" />}
                    label="Volver a la Tienda"
                    onClick={onExit}
                    isActive={false}
                />
                <NavLink 
                    icon={<ArrowUturnLeftIcon className="h-6 w-6" />}
                    label="Cerrar Sesión"
                    onClick={onLogout}
                    isActive={false}
                />
            </div>
        </aside>
    );
};