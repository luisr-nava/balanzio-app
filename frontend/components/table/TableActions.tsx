import { Button } from "@/components/ui/button";
import { Edit3, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
              className="flex items-center gap-2"
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
