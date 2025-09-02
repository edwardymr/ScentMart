import React, { useState } from 'react';
import { type Perfume } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { CatalogManagementPage } from './CatalogManagementPage';
import { AddProductPage } from './AddProductPage';
import { BrandIdentityPage } from './BrandIdentityPage';
import { IntegrationsPage } from './IntegrationsPage';

type AdminView = 'catalog' | 'add_product' | 'brand_identity' | 'integrations';

interface AdminPageProps {
    perfumes: Perfume[];
    logoUrl: string;
    onAddNewPerfume: (perfume: Perfume) => void;
    onUpdatePerfume: (perfume: Perfume) => void;
    onUpdateLogo: (newLogoUrl: string) => void;
    onExitAdmin: () => void;
    onLogout: () => void;
    onOpenSyncModal: () => void;
    onEditProduct: (perfume: Perfume) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ perfumes, logoUrl, onAddNewPerfume, onUpdatePerfume, onUpdateLogo, onExitAdmin, onLogout, onOpenSyncModal, onEditProduct }) => {
    const [view, setView] = useState<AdminView>('catalog');
    const [perfumeToEdit, setPerfumeToEdit] = useState<Perfume | null>(null);

    const handleSaveProduct = (perfume: Perfume) => {
        if (perfumeToEdit) {
            onUpdatePerfume(perfume);
        } else {
            onAddNewPerfume(perfume);
        }
        setPerfumeToEdit(null);
        setView('catalog');
    };

    const handleEditProduct = (perfume: Perfume) => {
        onEditProduct(perfume);
    };

    const renderContent = () => {
        switch (view) {
            case 'catalog':
                return <CatalogManagementPage perfumes={perfumes} onAddProduct={() => setView('add_product')} onEditProduct={handleEditProduct} onOpenSyncModal={onOpenSyncModal} />;
            case 'add_product':
                return <AddProductPage onSave={handleSaveProduct} onCancel={() => setView('catalog')} />;
            case 'brand_identity':
                return <BrandIdentityPage currentLogo={logoUrl} onUpdateLogo={onUpdateLogo} />;
            case 'integrations':
                return <IntegrationsPage perfumes={perfumes} />;
            default:
                return <CatalogManagementPage perfumes={perfumes} onAddProduct={() => setView('add_product')} onEditProduct={handleEditProduct} onOpenSyncModal={onOpenSyncModal} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#1c3a4a] flex">
            <AdminSidebar 
                onNavigate={(v) => setView(v as AdminView)} 
                onExit={onExitAdmin} 
                onLogout={onLogout}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};