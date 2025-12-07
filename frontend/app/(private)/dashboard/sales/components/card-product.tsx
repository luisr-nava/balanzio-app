import { motion } from "framer-motion";
import { Product } from "../../products/interfaces";

type CardProductProps = {
  product: Product;
  incrementProduct: (product: Product) => void;
};
export const CardProduct = ({
  product,
  incrementProduct,
}: CardProductProps) => {
  return (
    <motion.button
      key={product.id}
      className="rounded-lg border bg-background p-3 text-left shadow-sm flex flex-col gap-2"
      onClick={() => incrementProduct(product)}>
      <div className="aspect-video w-full rounded-md bg-muted overflow-hidden">
        <div className="h-full w-full bg-linear-to-br from-muted to-muted/80" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {product.description || "Sin descripción"}
        </p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">
          ${product.salePrice?.toLocaleString("es-AR") || 0}
        </span>
        <span className="text-xs text-muted-foreground">
          Stock: {product.stock ?? 0}
        </span>
      </div>
    </motion.button>
  );
};

