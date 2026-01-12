import { useQuery } from "@tanstack/react-query";
import { getSaleByIdAction } from "../actions";

export const useSaleByIdQuery = (saleId?: string) => {
  const query = useQuery({
    queryKey: ["sale", saleId],
    queryFn: () => getSaleByIdAction(saleId!),
    enabled: Boolean(saleId),
    
  },
);

  const sale = query.data;
  return {
    sale,
  };
};
