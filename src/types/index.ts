export interface ListItem {
  id: string;
  name: string;
  completed: boolean;
  quantity: number;
  unit: string;
  emoji?: string;
  cost?: number;
}

export interface List {
  id: string;
  name: string;
  createdBy: string;
  createdAt: any;
  items: ListItem[];
  shared: string[];
  shoppingDate?: string;
  active: boolean;
  supermarket?: string;
  customSupermarket?: string;
  totalCost?: number;
  completedAt?: any;
}

export interface PurchaseStats {
  totalSpent: number;
  visitsByStore: Record<string, number>;
  activeLists: number;
  yearlyPurchases: number;
  totalLists: number;
  currentMonthPurchases: number;
  currentMonthSpending: number;
  totalPurchases: number;
  dailySpending: Array<{
    date: string;
    amount: number;
  }>;
}