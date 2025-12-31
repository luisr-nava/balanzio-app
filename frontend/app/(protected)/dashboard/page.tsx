"use client";

import { useShopStore } from "@/features/shop/shop.store";
import { SelectShopCard } from "../components";
import { Analytics, Financial, Stats } from "@/features/dashboard/components";

export default function Dashboard() {
  const { activeShopId } = useShopStore();

  if (!activeShopId) return <SelectShopCard />;

  return (
    <>
      <Financial />
      <Stats />
      <Analytics />
    </>
  );
}

