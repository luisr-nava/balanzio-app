"use client";

import { useNotificationsQuery } from "@/app/(protected)/hooks/useNotificationsQuery";
import { usePrivateRouteGuard } from "@/features/auth/hooks/usePrivateRouteGuard";

import { StoreSelector } from "@/components/shops/store-selector";
import { Loading } from "@/components/loading";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotificationsQuery();
  const {
    isLoading,
    needsStoreSelection,
    handleSelectStore,
    shops,
    storedShops,
  } = usePrivateRouteGuard();

  if (isLoading) {
    return <Loading text="Verificando autenticación..." />;
  }
  const shopOptions = shops ?? storedShops;

  if (needsStoreSelection) {
    return (
      <StoreSelector
        shops={shopOptions}
        onSelect={handleSelectStore}
        onCreateSuccess={handleSelectStore}
      />
    );
  }
  return <>{children}</>;
}

