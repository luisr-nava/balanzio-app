export interface CashRegisterStateResponse {
  message: string;
  data: {
    hasOpenCashRegister: boolean;
    cashRegisterId?: string;
  };
}

