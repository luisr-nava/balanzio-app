export const ShopLoading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p className="text-muted-foreground">Cargando datos de la tienda...</p>
    </div>
  </div>
);
