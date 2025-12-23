import { create } from "zustand";
import type { NotificationEvent } from "@/lib/types/notification";

const sortByDateDesc = (notifications: NotificationEvent[]) =>
  [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const isNotificationRead = (notification: NotificationEvent) =>
  Boolean(notification.readAt || notification.isRead);

const getUnreadCount = (notifications: NotificationEvent[]) =>
  notifications.filter((notification) => !isNotificationRead(notification))
    .length;

interface NotificationsState {
  notifications: NotificationEvent[];
  unreadCount: number;
  setNotifications: (notifications: NotificationEvent[]) => void;
  addNotification: (notification: NotificationEvent) => void;
  markAsRead: (id: string) => void;
  markManyAsRead: (ids: string[]) => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) =>
    set(() => {
      const sorted = sortByDateDesc(notifications);
      return {
        notifications: sorted,
        unreadCount: getUnreadCount(sorted),
      };
    }),

  addNotification: (notification) =>
    set((state) => {
      const exists = state.notifications.some(
        (item) => item.id === notification.id,
      );
      const nextNotifications = exists
        ? state.notifications.map((item) =>
            item.id === notification.id ? { ...item, ...notification } : item,
          )
        : [notification, ...state.notifications];

      const sorted = sortByDateDesc(nextNotifications);

      return {
        notifications: sorted,
        unreadCount: getUnreadCount(sorted),
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const nextNotifications = state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
              readAt: notification.readAt,
            }
          : notification,
      );

      return {
        notifications: nextNotifications,
        unreadCount: getUnreadCount(nextNotifications),
      };
    }),

  markManyAsRead: (ids) =>
    set((state) => {
      const nextNotifications = state.notifications.map((notification) =>
        ids.includes(notification.id)
          ? {
              ...notification,
              isRead: true,
              readAt: notification.readAt,
            }
          : notification,
      );

      return {
        notifications: nextNotifications,
        unreadCount: getUnreadCount(nextNotifications),
      };
    }),

  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));
