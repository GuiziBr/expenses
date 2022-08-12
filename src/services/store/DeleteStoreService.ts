import { getRepository } from 'typeorm'
import Store from '../../models/Store'

class DeleteStoreService {
  public async execute(id: string): Promise<void> {
    const storesRepository = getRepository(Store)
    const existingStore = await storesRepository.findOne(id)
    if (existingStore && !existingStore.deleted_at) {
      const storeToDelete = storesRepository.create({ ...existingStore, deleted_at: new Date() })
      await storesRepository.save(storeToDelete)
    }
  }
}

export default DeleteStoreService
