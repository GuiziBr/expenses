import Bank, { TBank } from '../models/Bank'

export function bankAssembleUser({ id, name, created_at, updated_at }: Bank): TBank {
  return { id, name, created_at, updated_at }
}
