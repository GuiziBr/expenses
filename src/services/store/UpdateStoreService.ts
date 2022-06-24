import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Store from '../../models/Store'

class UpdateBankService {
  private async reactivate(storeIdToDelete: string, storeIdToRestore: string): Promise<Store | null> {
    const storesRepository = getRepository(Store)
    await Promise.all([
      storesRepository.save({ id: storeIdToDelete, deleted_at: new Date() }),
      storesRepository.save({ id: storeIdToRestore, deleted_at: null })
    ])
    const store = await storesRepository.findOne(storeIdToRestore)
    return store || null
  }

  public async execute(id: string, name: string): Promise<void> {
    const storesRepository = getRepository(Store)

    const [store, sameNameStore] = await Promise.all([
      storesRepository.findOne(id),
      storesRepository.findOne({ where: { name }, withDeleted: true })
    ])

    if (!store) throw new AppError(constants.errorMessages.notFoundStore, 404)

    if ((store && !sameNameStore) || (sameNameStore?.id === id)) {
      await storesRepository.save({
        ...store,
        name,
        updated_at: new Date()
      })
      return
    }
    if (sameNameStore) {
      if (!sameNameStore?.deleted_at) {
        throw new AppError(constants.errorMessages.duplicatedStoreName, 400)
      }
      const reactivatedStore = await this.reactivate(id, sameNameStore.id)
      if (!reactivatedStore) throw new AppError(constants.errorMessages.internalError, 500)
    }
  }
}

export default UpdateBankService
