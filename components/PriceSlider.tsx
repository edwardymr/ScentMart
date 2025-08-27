
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

export const PriceSlider: React.FC<PriceSliderProps> = ({ min, max, value, onChange }) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);
    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);
    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  const handleMouseUp = () => {
    onChange([minVal, maxVal]);
  };
  
  return (
    <div className="pt-8">
      <div ref={slider} className="relative w-full h-1 bg-[#3a6a82] rounded-full">
        <div ref={range} className="absolute h-1 bg-[#DAB162] rounded-full"></div>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="thumb thumb-left"
          style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="thumb thumb-right"
        />
      </div>
      <div className="flex justify-between mt-4 text-sm text-white">
        <span>{formatCurrency(minVal)}</span>
        <span>{formatCurrency(maxVal)}</span>
      </div>
    </div>
  );
};
