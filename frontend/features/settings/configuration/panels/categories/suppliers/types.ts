export interface CategorySupplier {
  id: string;
  name: string;
  shopId: string;
  shopIds?: string[];
  shopName: string;
  SupplierCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CategorySupplierFormValues {
  name: string;
  isActive: boolean;
  shopId: string[];
}

export interface CreateCategorySupplierDto {
  name: string;
  shopId?: string;
  shopIds: string[];
}
export interface CreateCategorySupplierResponse {
  message: string;
  data: CategorySupplier[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalAmount?: number;
  };
}

export type PaginatedCategorySupplier = {
  categorySupplier: CategorySupplier[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
