import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IRequest } from '../../domains/bank'
import AppError from '../../errors/AppError'
import Bank from '../../models/Bank'

class UpdateBankService {
  private async reactivate(bankIdToDelete: string, bankIdToRestore: string): Promise<Bank | null> {
    const bankRepository = getRepository(Bank)
    await Promise.all([
      bankRepository.softDelete(bankIdToDelete),
      bankRepository.restore(bankIdToRestore)
    ])
    const bank = await bankRepository.findOne(bankIdToDelete)
    return bank || null
  }

  public async execute({ id, name }: IRequest): Promise<void> {
    const bankRepository = getRepository(Bank)

    const [bank, sameNameBank] = await Promise.all([
      bankRepository.findOne(id),
      bankRepository.findOne({ where: { name }, withDeleted: true })
    ])

    if (!bank) throw new AppError(constants.errorMessages.notFoundBank, 404)

    if ((bank && !sameNameBank) || (sameNameBank?.id === id)) {
      await bankRepository.save({
        ...bank,
        name,
        updated_at: new Date()
      })
    }

    if (sameNameBank) {
      if (sameNameBank?.deleted_at) {
        throw new AppError(constants.errorMessages.duplicatedBankName, 400)
      }
      const reactivatedBank = await this.reactivate(id, sameNameBank.id)

      if (!reactivatedBank) throw new AppError(constants.errorMessages.internalError, 500)
    }
  }
}

export default UpdateBankService
