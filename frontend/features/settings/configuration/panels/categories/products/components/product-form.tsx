import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { User } from "@/features/auth/types";
import { CreateCategoryProductDto } from "../types";

interface Props {
  user: User | null;
  shops: { id: string; name: string }[];
  form: UseFormReturn<CreateCategoryProductDto>;
  onSubmit: (values: CreateCategoryProductDto) => void;
  isEditing: boolean;
  pending: boolean;
  handleCancelEdit: () => void;
}

export default function CategoryProductForm({
  user,
  shops,
  form,
  onSubmit,
  isEditing,
  pending,
  handleCancelEdit,
}: Props) {
  const { register, handleSubmit } = form;

  const name = form.watch("name");
  const canSubmit = name?.trim().length > 0;

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-1">
        <Label>Nombre *</Label>
        <Input
          {...register("name", { required: true })}
          placeholder="Lacteos"
        />
      </div>
      <div className="flex gap-5">
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            className="w-1/2"
            onClick={handleCancelEdit}
            disabled={pending}
          >
            Cancelar edición
          </Button>
        )}
        <Button
          className="ml-auto w-1/2"
          type="submit"
          disabled={pending || !canSubmit}
        >
          {pending
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
              ? "Actualizar categoría"
              : "Crear categoría"}
        </Button>
      </div>
    </form>
  );
}
