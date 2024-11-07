import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import ListCard from '../components/ListCard';
import NewListModal from '../components/NewListModal';
import { ShoppingList } from '../types/lists';

const Lists: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'lists'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShoppingList[];
      
      // Sort in memory instead of using orderBy in query
      setLists(listsData.sort((a, b) => 
        b.createdAt.toMillis() - a.createdAt.toMillis()
      ));
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateList = async (listData: Omit<ShoppingList, 'id' | 'userId' | 'items' | 'active' | 'createdAt'>) => {
    try {
      if (!user) return;

      await addDoc(collection(db, 'lists'), {
        ...listData,
        userId: user.uid,
        items: [],
        active: true,
        createdAt: Timestamp.now(),
        completedAt: null,
        totalCost: null
      });

      setIsNewListModalOpen(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleAddItem = async (listId: string, item: { name: string; quantity: number; unit: string }) => {
    try {
      const listRef = doc(db, 'lists', listId);
      const list = lists.find(l => l.id === listId);
      if (!list) return;

      const newItem = {
        id: crypto.randomUUID(),
        ...item,
        completed: false
      };

      await updateDoc(listRef, {
        items: [...list.items, newItem]
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (listId: string, itemId: string) => {
    try {
      const listRef = doc(db, 'lists', listId);
      const list = lists.find(l => l.id === listId);
      if (!list) return;

      const updatedItems = list.items.filter(item => item.id !== itemId);
      await updateDoc(listRef, { items: updatedItems });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    try {
      const listRef = doc(db, 'lists', listId);
      const list = lists.find(l => l.id === listId);
      if (!list) return;

      const updatedItems = list.items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      await updateDoc(listRef, { items: updatedItems });
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleToggleActive = async (list: ShoppingList) => {
    try {
      const listRef = doc(db, 'lists', list.id);
      
      if (list.active) {
        await updateDoc(listRef, {
          active: false,
          completedAt: Timestamp.now(),
          totalCost: list.totalCost || 0
        });
      } else {
        await updateDoc(listRef, {
          active: true,
          completedAt: null,
          totalCost: null
        });
      }
    } catch (error) {
      console.error('Error toggling list active state:', error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteDoc(doc(db, 'lists', listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleShare = (list: ShoppingList) => {
    const items = list.items
      .map(item => `${item.completed ? '✓' : '☐'} ${item.name} - ${item.quantity} ${item.unit}`)
      .join('\n');

    const text = `Lista de compra: ${list.name}\n\n` +
      `Supermercado: ${list.customSupermarket || list.supermarket}\n` +
      `Fecha: ${new Date(list.shoppingDate).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}\n\n` +
      `PENDIENTES:\n${items}` +
      (list.totalCost ? `\n\nTotal: ${new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(list.totalCost)}` : '');

    if (navigator.share) {
      navigator.share({
        title: `Lista de compra: ${list.name}`,
        text: text
      }).catch(() => {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mis Listas</h1>
        <button
          onClick={() => setIsNewListModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Nueva Lista</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lists.map(list => (
          <ListCard
            key={list.id}
            list={list}
            onShare={handleShare}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteList}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </div>

      <NewListModal
        isOpen={isNewListModalOpen}
        onClose={() => setIsNewListModalOpen(false)}
        onSubmit={handleCreateList}
      />
    </div>
  );
};

export default Lists;