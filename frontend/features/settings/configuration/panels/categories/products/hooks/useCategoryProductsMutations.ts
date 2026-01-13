import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateCategoryProductDto, PaginatedCategoryProducts } from "../types";
import {
  createCategoryProductAction,
  updateCategoryProductAction,
} from "../actions";

type CategoryProductsInfiniteData = InfiniteData<PaginatedCategoryProducts>;

export const useCategoryProductCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryProductDto) =>
      createCategoryProductAction(payload),
    onSuccess: (newCategories) => {
      const newCategory = newCategories[0];
      if (newCategory) {
        queryClient.setQueriesData<CategoryProductsInfiniteData>(
          { queryKey: ["category-products"], exact: false },
          (old) => {
            if (!old) return old;

            const firstPage = old.pages[0];

            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  categoryProducts: [newCategory, ...firstPage.categoryProducts],
                },
                ...old.pages.slice(1),
              ],
            };
          }
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["category-products"],
        exact: false,
      });
    },
  });
};

export const useCategoryProductUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCategoryProductDto>;
    }) => updateCategoryProductAction(id, payload),
    onSuccess: (updatedCategories) => {
      const updatedCategory = updatedCategories[0];
      if (updatedCategory) {
        queryClient.setQueriesData<CategoryProductsInfiniteData>(
          { queryKey: ["category-products"], exact: false },
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                categoryProducts: page.categoryProducts.map((cat) =>
                  cat.id === updatedCategory.id ? updatedCategory : cat
                ),
              })),
            };
          }
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["category-products"],
        exact: false,
      });
    },
  });
};
