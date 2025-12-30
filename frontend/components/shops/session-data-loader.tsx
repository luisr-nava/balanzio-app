"use client";

import { useMyShops } from "@/app/(protected)/hooks/useMyShops";

/**
 * Carga tiendas de la sesión una sola vez.
 * Montar en el layout privado; no renderiza UI.
 */
export function SessionDataLoader() {
  useMyShops();
  return null;
}

