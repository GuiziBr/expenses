import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Bank, { PlainObjectBank } from '../../models/Bank'

class CreateBankService {
  private async reactivateBank(bankToRestore: Bank): Promise<void> {
    const banksRepository = getRepository(Bank)
    await banksRepository.save({ ...bankToRestore, deleted_at: null })
  }

  private parseBank({ id, name, created_at, updated_at }: Bank): PlainObjectBank {
    return { id, name, created_at, updated_at }
  }

  public async execute(name: string): Promise<PlainObjectBank> {
    const banksRepository = getRepository(Bank)
    const existingBank = await banksRepository.findOne({ where: { name }, withDeleted: true })
    if (existingBank) {
      if (!existingBank.deleted_at) throw new AppError(constants.errorMessages.existingBank)
      else await this.reactivateBank(existingBank)
      return this.parseBank(existingBank)
    }
    const bank = banksRepository.create({ name })
    await banksRepository.save(bank)
    return this.parseBank(bank)
  }
}

export default CreateBankService
