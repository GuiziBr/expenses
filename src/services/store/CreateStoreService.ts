import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IStore } from '../../domains/store'
import AppError from '../../errors/AppError'
import Store from '../../models/Store'

class CreateStoreService {
  private assemblePaymentTypeResponse(store: IStore) {
    return {
      id: store.id,
      name: store.name,
      created_at: store.created_at
    }
  }

  public async execute(name: string): Promise<Omit<IStore, 'updated_at'>> {
    const storeRepository = getRepository(Store)
    const existingStore = await storeRepository.findOne({ where: { name }})
    if (existingStore) {
      if (!existingStore.deleted_at) throw new AppError(constants.errorMessages.existingStore)
      else await storeRepository.restore(existingStore.id)
      return this.assemblePaymentTypeResponse(existingStore)
    }
    const store = storeRepository.create({ name })
    await storeRepository.save(store)
    return this.assemblePaymentTypeResponse(store)
  }
}

export default CreateStoreService
