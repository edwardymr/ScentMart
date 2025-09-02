
import React from 'react';
import { FilterIcon, ChevronDownIcon } from './icons';

interface SortBarProps {
  resultCount: number;
  totalCount: number;
  sortBy: string;
  onSortChange: (value: any) => void;
  onFilterClick: () => void;
}

export const SortBar: React.FC<SortBarProps> = ({ resultCount, totalCount, sortBy, onSortChange, onFilterClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-[#2a556a] p-3 rounded-lg border border-[#3a6a82]">
      {/* Mobile Filter Button */}
      <button onClick={onFilterClick} className="md:hidden flex items-center justify-center gap-2 w-full mb-3 md:mb-0 px-4 py-2 bg-[#1c3a4a] text-white font-semibold rounded-md shadow-md">
        <FilterIcon className="h-5 w-5" />
        Filtrar
      </button>

      {/* Result Count */}
      <div className="text-sm text-gray-300 mb-3 md:mb-0">
        Mostrando <span className="font-bold text-white">{resultCount}</span> de <span className="font-bold text-white">{totalCount}</span> perfumes
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-by" className="text-sm text-gray-300">Ordenar por:</label>
        <div className="relative">
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-[#1c3a4a] border border-[#3a6a82] text-white text-sm font-semibold rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#DAB162] cursor-pointer"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: de menor a mayor</option>
            <option value="price-desc">Precio: de mayor a menor</option>
            <option value="newest">Novedades</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
