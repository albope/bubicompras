export interface ListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  supermarket: string;
  customSupermarket?: string;
  shoppingDate: string;
  items: ListItem[];
  active: boolean;
  createdAt: string;
  totalCost?: number;
}