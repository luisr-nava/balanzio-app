"use client";
import { useEffect } from "react";
import { useShopStore } from "@/app/(private)/store/shops.slice";
import { usePaginationParams } from "../../hooks/useQueryParams";
import { useCustomers } from "./hooks/useCustomers";
import { useCustomerForm } from "./hooks/useCustomerForm";
import { CustomerForm, CustomerHeader, TableCustomers } from "./components";
import { Modal } from "@/components/ui/modal";
import { ShopEmpty } from "@/components/shop-emty";
import { ShopLoading } from "@/components/shop-loading";
import { Empty, Loading } from "../../components";
import { Pagination } from "@/app/(private)/components";

export default function ClientesPage() {
  const { activeShopId, activeShopLoading } = useShopStore();

  const {
    search,
    setSearch,
    debouncedSearch,
    page,
    limit,
    setPage,
    setLimit,
  } = usePaginationParams(300);
  const { customers, customersLoading, pagination, isFetching } =
    useCustomers(debouncedSearch, page, limit);

  const form = useCustomerForm();
  const { customerModal, editCustomerModal, initialForm, reset } = form;

  useEffect(() => {
    if (!pagination) return;
    const maxPage = Math.max(pagination.totalPages, 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, pagination, setPage]);

  if (!activeShopId) return <ShopEmpty />;

  if (activeShopLoading) return <ShopLoading />;

  return (
    <div className="space-y-4">
      <CustomerHeader
        handleOpenCreate={form.handleOpenCreate}
        search={search}
        setSearch={setSearch}
      />
      {customersLoading ? (
        <Loading />
      ) : !customers || customers.length === 0 ? (
        <Empty description="No hay clientes cargados." />
      ) : (
        <div className="p-5 space-y-4">
          <TableCustomers customers={customers} handleEdit={form.handleEdit} />
          <Pagination
            page={page}
            totalPages={pagination?.totalPages ?? 1}
            limit={limit}
            onPageChange={(nextPage) => {
              if (nextPage < 1) return;
              setPage(nextPage);
            }}
            onLimitChange={(nextLimit) => setLimit(nextLimit)}
            isLoading={isFetching}
          />
        </div>
      )}

      <Modal
        isOpen={customerModal.isOpen || editCustomerModal.isOpen}
        onClose={() => {
          customerModal.close();
          editCustomerModal.close();
          reset({ ...initialForm, shopId: activeShopId || "" });
        }}
        title={editCustomerModal.isOpen ? "Editar cliente" : "Crear cliente"}
        description="Completa los datos del cliente"
        size="lg">
        <CustomerForm
          activeShopId={form.activeShopId}
          createMutation={form.createMutation}
          updateMutation={form.updateMutation}
          register={form.register}
          onSubmit={form.onSubmit}
          reset={form.reset}
          customerModal={form.customerModal}
          editCustomerModal={form.editCustomerModal}
          initialForm={form.initialForm}
          control={form.control}
          errors={form.errors}
        />
      </Modal>
    </div>
  );
}
