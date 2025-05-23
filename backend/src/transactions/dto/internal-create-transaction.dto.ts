import { CreateTransactionDto } from "./create-transaction.dto";

export class InternalCreateTransactionDto extends CreateTransactionDto {
  status: 'PENDING' | 'APPROVED' | 'FAILED';
  reference?: string;
}