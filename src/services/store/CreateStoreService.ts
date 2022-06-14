import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IStore } from '../../domains/store'
import AppError from '../../errors/AppError'
import Store from '../../models/Store'

class CreateStoreService {
  public async execute(name: string): Promise<Omit<IStore, 'updated_at'>> {
    const storeRepository = getRepository(Store)
    const storeExists = await storeRepository.findOne({ where: { name }})
    if (storeExists) throw new AppError(constants.errorMessages.existingStore)
    const store = storeRepository.create({ name })
    await storeRepository.save(store)
    return {
      id: store.id,
      name: store.name,
      created_at: store.created_at
    }
  }
}

export default CreateStoreService
