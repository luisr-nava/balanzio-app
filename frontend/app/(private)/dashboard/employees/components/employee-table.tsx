import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Employee } from "../interfaces";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  isFetching: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  deletingId?: string | null;
}

export const EmployeeTable = ({
  employees,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  deletingId,
}: EmployeeTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Cargando empleados...
      </div>
    );
  }

  if (!employees.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay empleados registrados en esta tienda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Nombre</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Rol</th>
            <th className="px-4 py-3 text-left font-medium">Estado</th>
            <th className="px-4 py-3 text-left font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t">
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{employee.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {employee.phone || "Sin teléfono"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">{employee.email}</td>
              <td className="px-4 py-3">
                <Badge variant="secondary">
                  {employee.role === "MANAGER" ? "Gerente" : "Empleado"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={employee.isActive ? "secondary" : "outline"}>
                  {employee.isActive ? "Activo" : "Suspendido"}
                </Badge>
              </td>
              <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === employee.id}
                  onClick={() => onDelete(employee)}>
                  {deletingId === employee.id ? "Eliminando..." : "Eliminar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isFetching && (
        <div className="flex items-center gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Actualizando lista...
        </div>
      )}
    </div>
  );
};
