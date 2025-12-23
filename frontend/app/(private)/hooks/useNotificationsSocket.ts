"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { notificationApi } from "@/lib/api/notification.api";
import {
  connectNotificationsSocket,
  disconnectNotificationsSocket,
} from "@/lib/notifications-socket";
import { useAuth } from "@/app/(auth)/hooks";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { useNotificationsStore } from "@/app/(private)/store/notifications.slice";
import type { NotificationEvent } from "@/lib/types/notification";
import { getErrorMessage } from "@/lib/error-handler";

export const useNotificationsSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const activeShopId = useShopStore((state) => state.activeShopId);
  const shouldForceStoreSelection = useShopStore(
    (state) => state.shouldForceStoreSelection,
  );
  const hasSelectedShop = Boolean(activeShopId) && !shouldForceStoreSelection;
  const {
    addNotification,
    setNotifications,
    clearNotifications,
  } = useNotificationsStore();

  // Cargar notificaciones persistentes al autenticarse
  useEffect(() => {
    if (!isAuthenticated || !token || !hasSelectedShop) {
      clearNotifications();
      return;
    }

    let isSubscribed = true;

    notificationApi
      .list()
      .then((notifications) => {
        if (isSubscribed) {
          setNotifications(notifications);
        }
      })
      .catch((error) => {
        const { title, message } = getErrorMessage(
          error,
          "No se pudieron cargar las notificaciones",
        );
        toast.error(title, { description: message });
      });

    return () => {
      isSubscribed = false;
    };
  }, [
    isAuthenticated,
    token,
    hasSelectedShop,
    setNotifications,
    clearNotifications,
  ]);

  // Conectar al socket y escuchar eventos
  useEffect(() => {
    if (!isAuthenticated || !token || !hasSelectedShop) {
      disconnectNotificationsSocket();
      return;
    }

    const socket = connectNotificationsSocket(token);

    if (!socket) return;

    const handleNotification = (notification: NotificationEvent) => {
      addNotification(notification);
      toast.info(notification.title, {
        description: notification.message,
      });
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [isAuthenticated, token, hasSelectedShop, addNotification]);

  // Desconectar al cerrar sesión
  useEffect(() => {
    if (!isAuthenticated || !hasSelectedShop) {
      disconnectNotificationsSocket();
    }
  }, [isAuthenticated, hasSelectedShop]);
};
