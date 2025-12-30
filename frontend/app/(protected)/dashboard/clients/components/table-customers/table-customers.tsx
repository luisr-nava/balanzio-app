import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Edit3,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { expandableRowVariants } from "@/lib/animations";
import type { Customer } from "../../interfaces";

interface Props {
  customers: Customer[];
  handleEdit: (customer: Customer) => void;
  handleDelete: (customer: Customer) => void;
  deletingId?: string | null;
}

export const TableCustomers = ({
  customers,
  handleEdit,
  handleDelete,
  deletingId,
}: Props) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="hidden sm:grid grid-cols-4 bg-muted px-4 py-2 text-sm font-semibold">
        <span>Nombre</span>
        <span className="text-center">Email</span>
        <span className="text-center">Teléfono</span>
        <span className="text-right">Acción</span>
      </div>
      <div className="divide-y">
        {customers.map((customer, index) => {
          const isOpen = expandedRow === customer.id;
          const isLastRow = index === customers.length - 1;

          return (
            <div
              key={customer.id}
              className={`last:border-b-0 ${
                customer.isActive ? "" : "bg-muted/50 text-muted-foreground"
              }`}>
              <motion.div
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.995 }}
                className={`w-full text-left transition-colors px-4 py-3 grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-4 sm:items-center ${
                  isOpen ? "bg-muted/50" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedRow(isOpen ? null : customer.id)}>
                <div className="sm:col-span-1 flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium line-clamp-1 flex items-center gap-2">
                      {customer.fullName}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <ChevronDown className="h-4 w-4 text-primary" />
                      </motion.div>
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center text-sm text-muted-foreground">
                  <span className="truncate">
                    {customer.email || "Sin email"}
                  </span>
                </div>
                <div className="hidden sm:flex items-center justify-center text-sm text-muted-foreground">
                  <span className="truncate">
                    {customer.phone || "Sin teléfono"}
                  </span>
                </div>

                <div className="hidden sm:flex justify-end">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(customer);
                    }}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="ml-2"
                    disabled={deletingId === customer.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(customer);
                    }}
                    aria-label={`Eliminar ${customer.fullName}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="sm:hidden col-span-2 flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>{customer.phone || "Sin teléfono"}</span>
                </div>
              </motion.div>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={expandableRowVariants}
                    className="overflow-hidden">
                    <div className="space-y-3 bg-muted/40 px-4 py-3 text-sm">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {customer.email || "Sin email"}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Teléfono:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {customer.phone || "Sin teléfono"}
                            </p>
                          </div>
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Dirección:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {customer.address || "Sin dirección"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between sm:flex-col sm:items-start sm:gap-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                              <StickyNote className="h-4 w-4" />
                              Notas:
                            </span>
                            <p className="font-medium text-right sm:text-left">
                              {customer.notes?.trim() || "Sin notas"}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 sm:hidden">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(customer);
                            }}>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingId === customer.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(customer);
                            }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletingId === customer.id
                              ? "Eliminando..."
                              : "Eliminar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isLastRow && <div className="border-b sm:hidden" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

