import React from 'react';
import { WhatsAppIcon } from './icons';

export const WhatsAppButton: React.FC = () => {
    const phoneNumber = '573213200601';
    const message = encodeURIComponent('Hola ScentMart, estoy interesado en sus perfumes y me gustaría más información.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-110"
            aria-label="Contactar por WhatsApp"
            title="Contactar por WhatsApp"
        >
            <WhatsAppIcon className="h-8 w-8" />
        </a>
    );
};
