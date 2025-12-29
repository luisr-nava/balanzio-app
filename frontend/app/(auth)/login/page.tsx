import { LoginForm } from "@/features/auth/components";
import Link from "next/link";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="w-full grid justify-center">
          <p>Cargando...</p>
        </div>
      }>
      <div className="w-full grid justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
          <p className="text-muted-foreground">Ingresa a tu cuenta</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 transition-all duration-300 font-medium">
            Registrarse
          </Link>
        </p>
      </div>
    </Suspense>
  );
}

