import React, { useState } from 'react';
import { SUPERMARKETS } from '../constants';
import EmojiPickerInput from './EmojiPickerInput';
import { X } from 'lucide-react';

interface NewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    supermarket: string;
    customSupermarket?: string;
    shoppingDate: string;
  }) => void;
}

const NewListModal: React.FC<NewListModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [supermarket, setSupermarket] = useState(SUPERMARKETS[0].value);
  const [customSupermarket, setCustomSupermarket] = useState('');
  const [shoppingDate, setShoppingDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      supermarket,
      ...(supermarket === 'otro' && { customSupermarket: customSupermarket.trim() }),
      shoppingDate
    });

    // Reset form
    setName('');
    setSupermarket(SUPERMARKETS[0].value);
    setCustomSupermarket('');
    setShoppingDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nueva Lista</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la lista
            </label>
            <EmojiPickerInput
              value={name}
              onChange={setName}
              placeholder="Lista de ejemplo"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supermercado
            </label>
            <select
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {SUPERMARKETS.map(market => (
                <option key={market.value} value={market.value}>
                  {market.label}
                </option>
              ))}
            </select>
          </div>

          {supermarket === 'otro' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especificar supermercado
              </label>
              <input
                type="text"
                value={customSupermarket}
                onChange={(e) => setCustomSupermarket(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del supermercado"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de compra
            </label>
            <input
              type="date"
              value={shoppingDate}
              onChange={(e) => setShoppingDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewListModal;