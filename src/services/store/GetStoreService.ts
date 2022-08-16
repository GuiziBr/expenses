import { getRepository, IsNull } from 'typeorm'
import Store, { PlainObjectStore } from '../../models/Store'

interface IListStoreResponse {
  stores: PlainObjectStore[],
  totalCount: number
}

class GetStoreService {
  private parseStore({ id, name, created_at, updated_at }: Store): PlainObjectStore {
    return { id, name, created_at, updated_at }
  }

  public async list(offset?: number, limit?: number): Promise<IListStoreResponse> {
    const storesRepository = getRepository(Store)
    const [stores, totalCount] = await storesRepository.findAndCount({ where: { deleted_at: IsNull() }, order: { name: 'ASC' }})
    const paginatedStores = typeof offset === 'number' ? stores.splice(offset, limit || stores.length) : stores
    return {
      stores: paginatedStores.map(this.parseStore),
      totalCount
    }
  }

  public async getById(id: string): Promise<PlainObjectStore | null> {
    const storesRepository = getRepository(Store)
    const store = await storesRepository.findOne({ where: { id, deleted_at: IsNull() }})
    return store ? this.parseStore(store) : null
  }
}

export default GetStoreService
