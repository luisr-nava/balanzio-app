export interface SupplierShop {
  shopId: string;
}

export interface SupplierCategory {
  id: string;
  name: string;
}
export interface Supplier {
  id: string;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;

  categoryId?: string | null;
  category?: SupplierCategory | null;

  supplierShop: SupplierShop[];

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierDto {
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  categoryId?: string | null;
  shopIds?: string[];
}

export interface GetSuppliersResponse {
  message?: string;
  suppliers: Supplier[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalAmount?: number;
  };
}
export interface CreateSupplierResponse {
  message: string;
  data: Supplier;
}
