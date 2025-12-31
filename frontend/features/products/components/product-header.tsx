import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  handleOpenCreate: () => void;
}

export default function ProductHeader({
  handleOpenCreate,
  search,
  setSearch,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label className="text-sm text-muted-foreground whitespace-nowrap">
            Buscar
          </Label>
          <Input
            className="w-full sm:w-48"
            placeholder="Nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto" onClick={handleOpenCreate}>
          Nuevo producto
        </Button>
      </div>
    </div>
  );
}

