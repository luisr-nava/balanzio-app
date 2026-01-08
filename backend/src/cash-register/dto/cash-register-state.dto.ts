export type CashRegisterStateDto =
  | {
      hasOpenCashRegister: false;
    }
  | {
      hasOpenCashRegister: true;
      cashRegisterId: string;
      openedAt: string;
      openedBy: string;
      openingAmount: number;
      currentAmount: number;
    };

export class OpenCashRegisterActorDto {
  id!: string;
  fullName!: string;
  role!: string;
}

export class OpenCashRegisterDto {
  id!: string;
  openedByUser!: OpenCashRegisterActorDto;
  openedAt!: string;
  expectedAmount!: number;
  status!: 'OPEN';
}

export class GetOpenCashRegistersResponseDto {
  message!: string;
  data!: {
    cashRegisters: OpenCashRegisterDto[];
  };
}
