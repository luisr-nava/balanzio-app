"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientesPage() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí podrás gestionar la información de tus clientes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
