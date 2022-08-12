import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Store, { PlainObjectStore } from '../../models/Store'

class CreateStoreService {
  private async reactivateStore(storeToRestore: Store): Promise<void> {
    const banksRepository = getRepository(Store)
    await banksRepository.save({ ...storeToRestore, deleted_at: null })
  }

  private parseStore({ id, name, created_at, updated_at }: Store): PlainObjectStore {
    return { id, name, created_at, updated_at }
  }

  public async execute(name: string): Promise<PlainObjectStore> {
    const storeRepository = getRepository(Store)
    const existingStore = await storeRepository.findOne({ where: { name }})
    if (existingStore) {
      if (!existingStore.deleted_at) throw new AppError(constants.errorMessages.existingStore)
      else await this.reactivateStore(existingStore)
      return this.parseStore(existingStore)
    }
    const store = storeRepository.create({ name })
    await storeRepository.save(store)
    return this.parseStore(store)
  }
}

export default CreateStoreService
