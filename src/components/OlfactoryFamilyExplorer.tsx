
import React from 'react';
import { type OlfactoryFamily } from '../types';
import { FloralIcon, OrientalIcon, WoodyIcon, CitrusIcon, AromaticIcon } from './icons';

interface OlfactoryFamilyExplorerProps {
  onFamilySelect: (family: OlfactoryFamily) => void;
}

const families: { name: OlfactoryFamily, Icon: React.FC<{className?: string}>, description: string }[] = [
  { name: 'Floral', Icon: FloralIcon, description: 'Elegancia en cada pétalo.' },
  { name: 'Oriental', Icon: OrientalIcon, description: 'Misterio y calidez exótica.' },
  { name: 'Amaderado', Icon: WoodyIcon, description: 'La fuerza de la naturaleza.' },
  { name: 'Cítrico', Icon: CitrusIcon, description: 'Frescura vibrante y energética.' },
  { name: 'Aromático', Icon: AromaticIcon, description: 'Pureza y vitalidad herbal.' },
];

export const OlfactoryFamilyExplorer: React.FC<OlfactoryFamilyExplorerProps> = ({ onFamilySelect }) => {
  return (
    <section className="bg-[#224859] py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif-display font-bold text-[#DAB162]">O explora por familia</h2>
          <p className="mt-2 text-lg text-gray-300">
            Cada familia olfativa es un universo. Encuentra el tuyo con un solo clic.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {families.map(({ name, Icon, description }) => (
            <button
              key={name}
              onClick={() => onFamilySelect(name)}
              className="group flex flex-col items-center p-6 bg-[#2a556a] rounded-lg border-2 border-transparent hover:border-[#DAB162] hover:bg-[#3a6a82] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-lg"
            >
              <Icon className="h-12 w-12 text-[#DAB162] mb-4 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="text-sm text-gray-400 mt-1 text-center">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
