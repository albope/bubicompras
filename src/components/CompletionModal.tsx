import React from 'react';

interface CompletionModalProps {
  show: boolean;
  onClose: () => void;
  amount: string;
  onAmountChange: (value: string) => void;
  onComplete: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  show,
  onClose,
  amount,
  onAmountChange,
  onComplete,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Completar Lista</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importe total de la compra
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Completar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;