import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShopStore } from "@/features/shop/shop.store";
import { CreateSaleDto } from "../types";
import { createSaleAction } from "../actions";
import { GetAllProductResponse, Product } from "@/features/products/types";
type ProductsQueryData = {
  products: Product[];
  pagination: GetAllProductResponse["pagination"];
};

export const useSaleCreateMutation = () => {
  const queryClient = useQueryClient();
  const { activeShopId } = useShopStore();

  return useMutation({
    mutationFn: (payload: CreateSaleDto) => createSaleAction(payload),

    onSuccess: (_data, payload) => {
      if (activeShopId) {
        queryClient.invalidateQueries({
          queryKey: ["sales", activeShopId],
        });

        queryClient.setQueryData<ProductsQueryData>(
          ["products", activeShopId],
          (old) => {
            if (!old) return old;

            return {
              ...old,
              products: old.products.map((product) => {
                const soldItem = payload.items.find(
                  (item) =>
                    item.shopProductId === (product.shopProductId ?? product.id)
                );

                if (!soldItem) return product;

                return {
                  ...product,
                  stock: Math.max(0, Number(product.stock) - soldItem.quantity),
                };
              }),
            };
          }
        );

        queryClient.invalidateQueries({
          queryKey: ["cash-register-state", activeShopId],
        });
      }
    },
  });
};
