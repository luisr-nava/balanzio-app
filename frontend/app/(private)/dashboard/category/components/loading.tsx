export const LoadingCategory = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="text-sm text-muted-foreground">Cargando categorías...</p>
    </div>
  );
};

