import { create } from "zustand";
import { ShopDetail, ShopState } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      shops: [],
      activeShopId: null,
      activeShop: null,
      activeShopLoading: false,
      shouldForceStoreSelection: true,
      setShops: (shops) => set({ shops }),
      setActiveShopId: (shopId) =>
        set((state) => {
          const isNewShop = state.activeShopId !== shopId;
          const fallbackShop =
            state.shops.find((shop) => shop.id === shopId) || null;
          return {
            activeShopId: shopId,
            activeShop: isNewShop
              ? (fallbackShop as ShopDetail | null)
              : state.activeShop,
            activeShopLoading: isNewShop && Boolean(shopId) && !fallbackShop,
          };
        }),
      setActiveShop: (shop) =>
        set({ activeShop: shop, activeShopLoading: false }),
      setActiveShopLoading: (loading) => set({ activeShopLoading: loading }),
      setShouldForceStoreSelection: (force) =>
        set({ shouldForceStoreSelection: force }),
      clearShops: () =>
        set({
          shops: [],
          activeShopId: null,
          activeShop: null,
          activeShopLoading: false,
          shouldForceStoreSelection: true,
        }),
    }),
    {
      name: "shop-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        shops: state.shops,
        activeShopId: state.activeShopId,
        activeShop: state.activeShop,
      }),
    },
  ),
);

