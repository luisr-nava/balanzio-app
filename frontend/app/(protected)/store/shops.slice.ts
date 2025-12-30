import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Shop, ShopDetail } from "@/lib/types/shop";

interface ShopState {
  shops: Shop[];
  activeShopId: string | null;
  activeShop: ShopDetail | null;
  activeShopLoading: boolean;
  shouldForceStoreSelection: boolean;
  setShops: (shops: Shop[]) => void;
  setActiveShopId: (shopId: string) => void;
  setActiveShop: (shop: ShopDetail | null) => void;
  setActiveShopLoading: (loading: boolean) => void;
  setShouldForceStoreSelection: (force: boolean) => void;
  clearShops: () => void;
}

/**
 * Estado global de tiendas (lista y tienda activa)
 */
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
          const fallbackShop = state.shops.find((shop) => shop.id === shopId) || null;
          return {
            activeShopId: shopId,
            activeShop: isNewShop ? (fallbackShop as ShopDetail | null) : state.activeShop,
            activeShopLoading: isNewShop && Boolean(shopId) && !fallbackShop,
          };
        }),
      setActiveShop: (shop) => set({ activeShop: shop, activeShopLoading: false }),
      setActiveShopLoading: (loading) => set({ activeShopLoading: loading }),
      setShouldForceStoreSelection: (force) => set({ shouldForceStoreSelection: force }),
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
