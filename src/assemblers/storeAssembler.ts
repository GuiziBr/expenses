import Store, { TStore } from '../models/Store'

export function storeAssembleUser({ id, name, created_at, updated_at }: Omit<Store, 'deleted_at'>): TStore {
  return { id, name, created_at, updated_at }
}
