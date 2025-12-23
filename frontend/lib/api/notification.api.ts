import { kioscoApi } from "@/lib/kioscoApi";
import { unwrapResponse } from "./utils";
import type {
  NotificationEvent,
  NotificationPreferences,
} from "@/lib/types/notification";

const NOTIFICATION_BASE_PATH = "/notifications";

export const notificationApi = {
  list: async (): Promise<NotificationEvent[]> => {
    const { data } = await kioscoApi.get<
      NotificationEvent[] | { data: NotificationEvent[] }
    >(NOTIFICATION_BASE_PATH);
    return unwrapResponse(data);
  },

  markAsRead: async (id: string): Promise<NotificationEvent> => {
    const { data } = await kioscoApi.patch<
      NotificationEvent | { data: NotificationEvent }
    >(`${NOTIFICATION_BASE_PATH}/${id}/read`, {});
    return unwrapResponse(data);
  },

  getPreferences: async (
    shopId: string,
  ): Promise<NotificationPreferences> => {
    const { data } = await kioscoApi.get<
      NotificationPreferences | { data: NotificationPreferences }
    >(`/shops/${shopId}/preferences/notifications`);
    return unwrapResponse(data);
  },

  updatePreferences: async (
    shopId: string,
    payload: NotificationPreferences,
  ): Promise<NotificationPreferences> => {
    const { data } = await kioscoApi.put<
      NotificationPreferences | { data: NotificationPreferences }
    >(`/shops/${shopId}/preferences/notifications`, payload);
    return unwrapResponse(data);
  },
};
