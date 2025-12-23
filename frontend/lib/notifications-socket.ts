"use client";

import { io, type Socket } from "socket.io-client";

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_KIOSCO_WS_URL ||
  process.env.NEXT_PUBLIC_KIOSCO_API_URL ||
  process.env.NEXT_PUBLIC_API_URL;

let socket: Socket | null = null;

export const getNotificationsSocket = () => socket;

export const connectNotificationsSocket = (token: string) => {
  if (!WS_BASE_URL || !token) return null;

  const shouldReuseExisting =
    socket &&
    socket.connected &&
    (socket.auth as { token?: string } | undefined)?.token ===
      `Bearer ${token}`;

  if (shouldReuseExisting) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  socket = io(WS_BASE_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    auth: {
      token: `Bearer ${token}`,
    },
  });

  return socket;
};

export const disconnectNotificationsSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
