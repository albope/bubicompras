export const formatListForShare = (list: any) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  let message = `Lista de compra: ${list.name}\n\n`;
  
  message += `Supermercado: ${list.customSupermarket || list.supermarket}\n`;
  message += `Fecha: ${formatDate(list.shoppingDate)}\n\n`;
  
  const pendingItems = list.items.filter((item: any) => !item.completed);
  const completedItems = list.items.filter((item: any) => item.completed);

  if (pendingItems.length > 0) {
    message += `PENDIENTES:\n`;
    pendingItems.forEach((item: any) => {
      message += `[ ] ${item.name} - ${item.quantity} ${item.unit}\n`;
    });
    message += '\n';
  }

  if (completedItems.length > 0) {
    message += `COMPLETADOS:\n`;
    completedItems.forEach((item: any) => {
      message += `[x] ${item.name} - ${item.quantity} ${item.unit}\n`;
    });
    message += '\n';
  }

  if (list.totalCost) {
    message += `Total: ${new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(list.totalCost)}`;
  }

  return message;
};