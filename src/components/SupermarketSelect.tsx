import React from 'react';
import { SUPERMARKETS } from '../constants';

interface SupermarketSelectProps {
  value: string;
  customValue?: string;
  onChange: (value: string, customValue?: string) => void;
  className?: string;
}

const SupermarketSelect: React.FC<SupermarketSelectProps> = ({
  value,
  customValue,
  onChange,
  className
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('Otro', e.target.value);
  };

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={handleChange}
        className={className}
      >
        <option value="">Seleccionar supermercado</option>
        {SUPERMARKETS.map(market => (
          <option key={market} value={market}>{market}</option>
        ))}
      </select>
      
      {value === 'Otro' && (
        <input
          type="text"
          value={customValue || ''}
          onChange={handleCustomChange}
          placeholder="Nombre del supermercado"
          className={className}
        />
      )}
    </div>
  );
};

export default SupermarketSelect;