export type NotificationType = "LOW_STOCK";

export interface NotificationEvent {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  shopId: string;
  createdAt: string;
  readAt?: string | null;
  isRead?: boolean;
}

export interface NotificationPreferences {
  receiveNotifications: boolean;
  lowStockThreshold: number;
}
