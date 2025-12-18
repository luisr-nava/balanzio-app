export interface Customer {
  id: string;
  shopId: string;
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  isActive: boolean;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
  shopName?: string;
  totalPurchases?: number;
  totalSpent?: number;
  lastPurchaseDate?: string | null;
}

export interface CreateCustomerDto {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  dni?: string;
  address?: string | null;
  creditLimit?: number;
  notes?: string | null;
  shopId: string;
}

export interface GetAllCustomerResponse {
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Customer[];
}
