
import React from 'react';
import { Filters } from './CatalogView';
import { Accordion } from './Accordion';
import { PriceSlider } from './PriceSlider';
import { type OlfactoryFamily } from '../types';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: any) => void;
  onClearFilters: () => void;
  priceConfig: { min: number; max: number };
  olfactoryFamilies: OlfactoryFamily[];
  genders: ('Hombre' | 'Mujer' | 'Unisex')[];
}

const CheckboxFilter: React.FC<{
    label: string;
    checked: boolean;
    onChange: () => void;
}> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-[#2a556a]">
        <input 
            type="checkbox" 
            checked={checked}
            onChange={onChange}
            className="h-5 w-5 rounded bg-[#1c3a4a] border-[#3a6a82] text-[#DAB162] focus:ring-[#DAB162] focus:ring-offset-0"
        />
        <span className="text-gray-300">{label}</span>
    </label>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onClearFilters, priceConfig, olfactoryFamilies, genders }) => {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Filtrar por</h3>
            <button onClick={onClearFilters} className="text-sm text-[#DAB162] hover:underline">
                Limpiar filtros
            </button>
        </div>

        <Accordion title="Género" defaultOpen>
            <div className="space-y-2">
                {genders.map(gender => (
                    <CheckboxFilter 
                        key={gender}
                        label={gender}
                        checked={filters.gender.includes(gender)}
                        onChange={() => onFilterChange('gender', gender)}
                    />
                ))}
            </div>
        </Accordion>

        <Accordion title="Familia Olfativa" defaultOpen>
             <div className="space-y-2">
                {olfactoryFamilies.map(family => (
                    <CheckboxFilter 
                        key={family}
                        label={family}
                        checked={filters.olfactoryFamily.includes(family)}
                        onChange={() => onFilterChange('olfactoryFamily', family)}
                    />
                ))}
            </div>
        </Accordion>

        <Accordion title="Rango de Precio" defaultOpen>
            <div className="p-2">
                <PriceSlider 
                    min={priceConfig.min}
                    max={priceConfig.max}
                    value={filters.priceRange}
                    onChange={(newRange) => onFilterChange('priceRange', newRange)}
                />
            </div>
        </Accordion>
    </div>
  );
};
