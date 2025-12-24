import { kioscoApi } from "@/lib/kioscoApi";
import { unwrapResponse } from "./utils";
import type { CashRegister, OpenCashRegisterDto } from "@/lib/types/cash-register";
import type {
  CashRegisterReport,
  CashRegisterReportsApiResponse,
  PeriodFilter,
} from "@/lib/types/cash-register-report";

const CASH_REGISTER_BASE_PATH = "/cash-register";

export const cashRegisterApi = {
  // Verificar si hay una caja abierta para la tienda
  getOpenCashRegister: async (shopId: string): Promise<CashRegister | null> => {
    if (!shopId) throw new Error("shopId es requerido");

    try {
      const { data } = await kioscoApi.get<CashRegister | { data: CashRegister } | null>(
        `${CASH_REGISTER_BASE_PATH}/open`,
        {
          params: { shopId },
        },
      );
      const payload = unwrapResponse(data);
      return payload ?? null;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Abrir caja
  openCashRegister: async (
    payload: OpenCashRegisterDto,
  ): Promise<CashRegister> => {
    if (!payload.shopId) {
      throw new Error("shopId es requerido");
    }

    try {
      const { data } = await kioscoApi.post<
        CashRegister | { data: CashRegister }
      >(`${CASH_REGISTER_BASE_PATH}/open`, payload, {
        params: { shopId: payload.shopId },
      });
      return unwrapResponse(data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new Error("Caja no encontrada para la tienda seleccionada");
      }
      throw error;
    }
  },

  getReports: async (period: PeriodFilter): Promise<CashRegisterReport[]> => {
    if (!period) {
      throw new Error("Periodo de reporte es requerido");
    }

    const { data } = await kioscoApi.get<CashRegisterReportsApiResponse>(
      `${CASH_REGISTER_BASE_PATH}/reports`,
      {
        params: { period },
      },
    );

    return unwrapResponse(data);
  },
};
