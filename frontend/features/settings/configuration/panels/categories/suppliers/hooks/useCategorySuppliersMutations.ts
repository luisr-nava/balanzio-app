import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateCategorySupplierDto, PaginatedCategorySupplier } from "../types";
import {
  createCategorySupplierAction,
  updateCategorySupplierAction,
} from "../actions";

type CategorySupplierInfiniteData = InfiniteData<PaginatedCategorySupplier>;

export const useCategorySupplierCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategorySupplierDto) =>
      createCategorySupplierAction(payload),
    onSuccess: (newCategories) => {
      const newCategory = newCategories[0];
      if (newCategory) {
        queryClient.setQueriesData<CategorySupplierInfiniteData>(
          { queryKey: ["category-suppliers"], exact: false },
          (old) => {
            if (!old) return old;

            const firstPage = old.pages[0];

            return {
              ...old,
              pages: [
                {
                  ...firstPage,
                  categorySupplier: [newCategory, ...firstPage.categorySupplier],
                },
                ...old.pages.slice(1),
              ],
            };
          }
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["category-suppliers"],
        exact: false,
      });
    },
  });
};

export const useCategorySupplierUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCategorySupplierDto>;
    }) => updateCategorySupplierAction(id, payload),
    onSuccess: (updatedCategories) => {
      const updatedCategory = updatedCategories[0];
      if (updatedCategory) {
        queryClient.setQueriesData<CategorySupplierInfiniteData>(
          { queryKey: ["category-suppliers"], exact: false },
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                categorySupplier: page.categorySupplier.map((cat) =>
                  cat.id === updatedCategory.id ? updatedCategory : cat
                ),
              })),
            };
          }
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["category-suppliers"],
        exact: false,
      });
    },
  });
};
