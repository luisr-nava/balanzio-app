import { ProductCategoriesPanel } from "./categories/products/components";
import { SupplierCategoriesPanel } from "./categories/suppliers/components";

export default function CategoriesPanel() {
  return (
    <div className="space-y-10">
      <ProductCategoriesPanel />
      <SupplierCategoriesPanel />
    </div>
  );
}
