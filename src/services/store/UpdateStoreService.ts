import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IRequest } from '../../domains/store'
import AppError from '../../errors/AppError'
import Store from '../../models/Store'

class UpdateBankService {
  private async reactivate(storeIdToDelete: string, storeIdToRestore: string): Promise<Store | null> {
    const storeRepository = getRepository(Store)
    await Promise.all([
      storeRepository.softDelete(storeIdToDelete),
      storeRepository.restore(storeIdToRestore)
    ])
    const store = await storeRepository.findOne(storeIdToDelete)
    return store || null
  }

  public async execute({ id, name }: IRequest): Promise<void> {
    const storeRepository = getRepository(Store)

    const [store, sameNameStore] = await Promise.all([
      storeRepository.findOne(id),
      storeRepository.findOne({ where: { name }, withDeleted: true })
    ])

    if (!store) throw new AppError(constants.errorMessages.notFoundStore, 404)

    if ((store && !sameNameStore) || (sameNameStore?.id === id)) {
      await storeRepository.save({
        ...store,
        name,
        updated_at: new Date()
      })
    }

    if (sameNameStore) {
      if (sameNameStore?.deleted_at) {
        throw new AppError(constants.errorMessages.duplicatedStoreName, 400)
      }
      const reactivatedBank = await this.reactivate(id, sameNameStore.id)

      if (!reactivatedBank) throw new AppError(constants.errorMessages.internalError, 500)
    }
  }
}

export default UpdateBankService
