import React, { useState } from 'react';
import { Share2, Check, X, Trash2, XCircle, ChevronDown } from 'lucide-react';
import ListItemForm from './ListItemForm';
import PurchaseAmountModal from './PurchaseAmountModal';
import { ShoppingList, ListItem } from '../types/lists';

interface ListCardProps {
  list: ShoppingList;
  onShare: (list: ShoppingList) => void;
  onToggleActive: (list: ShoppingList) => void;
  onDelete: (listId: string) => void;
  onAddItem: (listId: string, item: Omit<ListItem, 'id' | 'completed'>) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
}

const ListCard: React.FC<ListCardProps> = ({
  list,
  onShare,
  onToggleActive,
  onDelete,
  onAddItem,
  onToggleItem,
  onDeleteItem,
}) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleActive = () => {
    if (list.active) {
      setShowPurchaseModal(true);
    } else {
      onToggleActive(list);
    }
  };

  const handlePurchaseAmount = (amount: number) => {
    const updatedList = {
      ...list,
      totalCost: amount
    };
    onToggleActive(updatedList);
    setShowPurchaseModal(false);
  };

  const completedItems = list.items.filter(item => item.completed);
  const pendingItems = list.items.filter(item => !item.completed);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 ${
      !list.active ? 'opacity-75' : 'hover:shadow-md'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{list.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              {list.customSupermarket || list.supermarket}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(list.shoppingDate)}
            </p>
            {!list.active && list.totalCost !== undefined && list.totalCost !== null && (
              <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                Total: {formatCurrency(list.totalCost)}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onShare(list)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Compartir"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleToggleActive}
              className={`${
                list.active 
                  ? 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300' 
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              } transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700`}
              title={list.active ? 'Completar' : 'Reactivar'}
            >
              {list.active ? <Check size={18} /> : <X size={18} />}
            </button>
            <button
              onClick={() => onDelete(list.id)}
              className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {list.active && (
          <div className="mb-4">
            <ListItemForm onAddItem={(item) => onAddItem(list.id, item)} />
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            <span>
              {pendingItems.length} pendiente{pendingItems.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ChevronDown
                size={16}
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-1">
              {pendingItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <button
                    onClick={() => onToggleItem(list.id, item.id)}
                    className="flex-1 text-left text-sm text-gray-700 dark:text-gray-200"
                  >
                    <span className="inline-block min-w-0 break-words">
                      {item.name} - {item.quantity} {item.unit}
                    </span>
                  </button>
                  <button
                    onClick={() => onDeleteItem(list.id, item.id)}
                    className="ml-2 text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Eliminar item"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}

              {completedItems.length > 0 && (
                <>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">
                    {completedItems.length} completado{completedItems.length !== 1 ? 's' : ''}
                  </div>
                  {completedItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50/50 dark:bg-gray-700/25 rounded-lg"
                    >
                      <button
                        onClick={() => onToggleItem(list.id, item.id)}
                        className="flex-1 text-left text-sm text-gray-400 dark:text-gray-500 line-through"
                      >
                        <span className="inline-block min-w-0 break-words">
                          {item.name} - {item.quantity} {item.unit}
                        </span>
                      </button>
                      <button
                        onClick={() => onDeleteItem(list.id, item.id)}
                        className="ml-2 text-red-300 hover:text-red-400 dark:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                        title="Eliminar item"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {showPurchaseModal && (
        <PurchaseAmountModal
          onConfirm={handlePurchaseAmount}
          onCancel={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  );
};

export default ListCard;