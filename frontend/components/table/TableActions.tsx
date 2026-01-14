import { Button } from "@/components/ui/button";
import { Edit3, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Props<T> {
  row: T;
  actions: {
    type: "edit" | "delete";
    onClick: (row: T) => void;
    disabled?: boolean | ((row: T) => boolean);
  }[];
}

export function TableActions<T>({ row, actions }: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {actions.map((action, index) => {
          const isDisabled =
            typeof action.disabled === "function"
              ? action.disabled(row)
              : action.disabled;

          return (
            <DropdownMenuItem
              key={index}
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  action.onClick(row);
                }
              }}
              className={cn(
                "flex cursor-pointer items-center gap-2 transition-all duration-500",
                action.type === "edit" &&
                  "data-highlighted:bg-gray-600 data-highlighted:text-white",
                action.type === "delete" &&
                  "text-destructive data-highlighted:bg-red-200/10 data-highlighted:text-white"
              )}
            >
              {action.type === "edit" && (
                <>
                  <Edit3 className="h-4 w-4" />
                  <span>Editar</span>
                </>
              )}

              {action.type === "delete" && (
                <>
                  <Trash2 className="text-destructive h-4 w-4" />
                  <span className="text-destructive">Eliminar</span>
                </>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
