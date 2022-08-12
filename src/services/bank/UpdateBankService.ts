import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Bank from '../../models/Bank'

class UpdateBankService {
  private async reactivate(bankIdToDelete: string, bankIdToRestore: string): Promise<Bank | null> {
    const banksRepository = getRepository(Bank)

    const bankToDelete = banksRepository.create({ id: bankIdToDelete, deleted_at: new Date() })
    const bankToReactivate = banksRepository.create({ id: bankIdToRestore, deleted_at: null })

    await Promise.all([
      banksRepository.save(bankToDelete),
      banksRepository.save(bankToReactivate)
    ])

    return bankToReactivate
  }

  public async execute(id: string, name: string): Promise<void> {
    const banksRepository = getRepository(Bank)

    const [bank, sameNameBank] = await Promise.all([
      banksRepository.findOne(id),
      banksRepository.findOne({ where: { name }, withDeleted: true })
    ])

    if (!bank) throw new AppError(constants.errorMessages.notFoundBank, 404)

    if ((bank && !sameNameBank) || (sameNameBank?.id === id)) {
      const bankToUpdate = banksRepository.create({ ...bank, name, updated_at: new Date() })
      await banksRepository.save(bankToUpdate)
      return
    }
    if (sameNameBank) {
      if (!sameNameBank?.deleted_at) {
        throw new AppError(constants.errorMessages.duplicatedBankName, 400)
      }
      const reactivatedBank = await this.reactivate(id, sameNameBank.id)
      if (!reactivatedBank) throw new AppError(constants.errorMessages.internalError, 500)
    }
  }
}

export default UpdateBankService
