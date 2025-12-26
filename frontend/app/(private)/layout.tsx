"use client";

import { PrivateRouteGuard } from "@/components/guards/private-route-guard";
import { StoreSetupGuard } from "@/components/guards/store-setup-guard";
import { SessionDataLoader } from "@/components/shops/session-data-loader";
import { useNotificationsSocket } from "@/app/(private)/hooks/useNotificationsSocket";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotificationsSocket();

  return (
    <PrivateRouteGuard>
      <StoreSetupGuard>
        <SessionDataLoader />
        {children}
      </StoreSetupGuard>
    </PrivateRouteGuard>
  );
}

