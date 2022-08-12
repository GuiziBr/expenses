import { getRepository } from 'typeorm'
import { storeAssembleUser } from '../../assemblers/storeAssembler'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Store, { TStore } from '../../models/Store'

class CreateStoreService {
  private async reactivateStore(storeToRestore: Store): Promise<void> {
    const banksRepository = getRepository(Store)
    await banksRepository.save({ ...storeToRestore, deleted_at: null })
  }

  public async execute(name: string): Promise<TStore> {
    const storeRepository = getRepository(Store)
    const existingStore = await storeRepository.findOne({ where: { name }})
    if (existingStore) {
      if (!existingStore.deleted_at) throw new AppError(constants.errorMessages.existingStore)
      else await this.reactivateStore(existingStore)
      return storeAssembleUser(existingStore)
    }
    const store = storeRepository.create({ name })
    await storeRepository.save(store)
    return storeAssembleUser(store)
  }
}

export default CreateStoreService
