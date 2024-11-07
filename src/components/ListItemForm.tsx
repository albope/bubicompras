import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { UNITS } from '../constants';
import EmojiPickerInput from './EmojiPickerInput';

interface ListItemFormProps {
  onAddItem: (item: { name: string; quantity: number; unit: string }) => void;
}

const ListItemForm: React.FC<ListItemFormProps> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('unidad');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      quantity,
      unit
    });

    setName('');
    setQuantity(1);
    setUnit('unidad');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2">
        <div className="flex-grow min-w-0">
          <EmojiPickerInput
            value={name}
            onChange={setName}
            placeholder="Añadir producto"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 px-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-gray-700"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-24 px-2 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-700"
          >
            {UNITS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="shrink-0 w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md active:shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ListItemForm;