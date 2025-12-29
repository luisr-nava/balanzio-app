"use client";

import { useEffect } from "react";
import { useAuthStore } from "../auth.slice";

export function useAuthHydration() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
