import React from 'react';
import { TruckIcon } from './icons';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#DAB162] text-[#224859] py-2 px-4 text-center text-sm sm:text-base font-semibold w-full z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <TruckIcon className="h-5 w-5 hidden sm:inline-block" />
        <span>Envíos Gratis en Santa Marta | Compra hoy y recíbelo sin costo.</span>
      </div>
    </div>
  );
};
