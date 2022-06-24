import { getRepository } from 'typeorm'
import { bankAssembleUser } from '../../assemblers/bankAssembler'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Bank from '../../models/Bank'

class CreateBankService {
  private async reactivateBank(bankToRestore: Bank): Promise<void> {
    const banksRepository = getRepository(Bank)
    await banksRepository.save({ ...bankToRestore, deleted_at: null })
  }

  public async execute(name: string): Promise<Omit<Bank, 'deleted_at'>> {
    const banksRepository = getRepository(Bank)
    const existingBank = await banksRepository.findOne({ where: { name }, withDeleted: true })
    if (existingBank) {
      if (!existingBank.deleted_at) throw new AppError(constants.errorMessages.existingBank)
      else await this.reactivateBank(existingBank)
      return bankAssembleUser(existingBank)
    }
    const bank = banksRepository.create({ name })
    await banksRepository.save(bank)
    return bankAssembleUser(bank)
  }
}

export default CreateBankService
