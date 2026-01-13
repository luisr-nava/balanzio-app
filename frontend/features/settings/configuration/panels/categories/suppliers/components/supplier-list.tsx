import type { UIEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3 } from "lucide-react";

interface Item {
  id: string;
  name: string;
  shopName?: string;
  shopId?: string;
  shopIds?: string[];
  shopNames?: string[];
}

interface Props<T extends Item> {
  items: T[];
  loading: boolean;
  isOwner: boolean;
  onEdit: (item: T) => void;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
}

export default function CategoryProductList<T extends Item>({
  items,
  loading,
  isOwner,
  onEdit,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: Props<T>) {
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage || loading) return;

    const el = event.currentTarget;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
      fetchNextPage?.();
    }
  };

  return (
    <div className="rounded-lg border px-4 py-2">
      <div className="mb-3 flex items-center gap-2">
        <p className="font-semibold">Listado de categorías</p>
      </div>
      <div
        className="borderpr-1 max-h-40 min-h-40 overflow-y-auto"
        onScroll={handleScroll}
      >
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aún no tienes categorías.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((category) => (
              <li
                key={category.id}
                className="bg-background flex items-center gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{category.name}</p>
                  {/* {isOwner && (
                    <p className="text-muted-foreground truncate text-xs">
                      {(category.shopNames && category.shopNames.length > 0
                        ? category.shopNames
                        : [category.shopName || category.shopId]
                      )?.join(", ")}
                    </p>
                  )} */}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {isOwner &&
                    (category.shopNames && category.shopNames.length > 0 ? (
                      category.shopNames.map((shop, idx) => (
                        <Badge
                          key={`${category.id}-${shop}-${idx}`}
                          variant="secondary"
                          className="whitespace-nowrap"
                        >
                          {shop}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {category.shopName || category.shopId}
                      </Badge>
                    ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(category)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {isFetchingNextPage && (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-2 text-xs">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            <span>Cargando más categorías...</span>
          </div>
        )}
      </div>
    </div>
  );
}
