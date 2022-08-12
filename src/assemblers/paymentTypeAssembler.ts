import PaymentType, { TPaymentType } from '../models/PaymentType'

export function paymentTypeAssembleUser({
  id,
  description,
  hasStatement,
  created_at,
  updated_at
}: Omit<PaymentType, 'deleted_at'>): TPaymentType {
  return { id, description, hasStatement: hasStatement || false, created_at, updated_at }
}
