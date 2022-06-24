import Bank from '../models/Bank'

type IBank = Omit<Bank, 'deleted_at'>

export function bankAssembleUser({ id, name, created_at, updated_at }: Omit<Bank, 'deleted_at'>): IBank {
  return { id, name, created_at, updated_at }
}
