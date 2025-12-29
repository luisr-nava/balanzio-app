"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRouter } from "next/router";
import { ResetPasswordForm } from "@/features/auth/components";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  if (!token) return router.push("/forgot-password");

  return (
    <Suspense
      fallback={
        <div className="w-full grid justify-center">
          <p>Cargando...</p>
        </div>
      }>
      <div className="w-full grid justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Restablecer Contraseña</h1>
          <p className="text-muted-foreground">
            Ingresa tu nueva contraseña para tu cuenta
          </p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </Suspense>
  );
}

