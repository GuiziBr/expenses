import PaymentType from '../models/PaymentType'

type IPaymentType = Omit<PaymentType, 'deleted_at'>

export function paymentTypeAssembleUser({
  id,
  description,
  hasStatement,
  created_at,
  updated_at
}: Omit<PaymentType, 'deleted_at'>): IPaymentType {
  return { id, description, hasStatement: hasStatement || false, created_at, updated_at }
}
