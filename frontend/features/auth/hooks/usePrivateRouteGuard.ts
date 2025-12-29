import { useShopStore } from "@/app/(private)/store/shops.slice";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllShops } from "@/features/shop/actions/get-all.shops.action";

export function usePrivateRouteGuard() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    shops: storedShops,
    activeShopId,
    setShops,
    setActiveShopId,
    setActiveShop,
    setShouldForceStoreSelection,
  } = useShopStore();
  const { data: shops } = useQuery({
    queryKey: ["my-shops"],
    queryFn: () => getAllShops(),
    enabled: isAuthenticated,
    retry: 1,
  });
  useEffect(() => {
    if (!shops) return;

    setShops(shops);

    const activeExists =
      Boolean(activeShopId) && shops.some((shop) => shop.id === activeShopId);

    if (!activeExists && activeShopId) {
      setActiveShopId("");
      setActiveShop(null);
      setShouldForceStoreSelection(true);
    }
  }, [
    shops,
    activeShopId,
    setShops,
    setActiveShopId,
    setActiveShop,
    setShouldForceStoreSelection,
  ]);
  useEffect(() => {
    const handler = () => {
      setActiveShopId("");
      setActiveShop(null);
      setShouldForceStoreSelection(true);
    };

    window.addEventListener("open-store-selector", handler);
    return () => window.removeEventListener("open-store-selector", handler);
  }, [setActiveShopId, setActiveShop, setShouldForceStoreSelection]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSelectStore = (storeId: string) => {
    setActiveShopId(storeId);
    setShouldForceStoreSelection(false);
  };

  const needsStoreSelection = isAuthenticated && !activeShopId;
  return {
    isLoading,
    isAuthenticated,
    shops: shops ?? storedShops,
    needsStoreSelection,
    handleSelectStore,
    storedShops,
  };
}


