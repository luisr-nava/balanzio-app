export interface CategoryProduct {
  id: string;
  name: string;
  shopId: string;
  shopIds?: string[];
  shopName: string;
  productsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface CategoryProductFormValues {
  name: string;
  isActive: boolean;
  shopId: string[];
}

export interface CreateCategoryProductDto {
  name: string;
  shopId?: string;
  shopIds: string[];
}
export interface CreateCategoryProductResponse {
  message: string;
  data: CategoryProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    totalAmount?: number;
  };
}

export type PaginatedCategoryProducts = {
  categoryProducts: CategoryProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
