import Store from '../models/Store'

type IStore = Omit<Store, 'deleted_at'>

export function storeAssembleUser({ id, name, created_at, updated_at }: Omit<Store, 'deleted_at'>): IStore {
  return { id, name, created_at, updated_at }
}
