import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IBank } from '../../domains/bank'
import AppError from '../../errors/AppError'
import Bank from '../../models/Bank'

class CreateBankService {
  private assembleBankResponse(bank: IBank) {
    return {
      id: bank.id,
      name: bank.name,
      created_at: bank.created_at
    }
  }

  public async execute(name: string): Promise<Omit<IBank, 'updated_at'>> {
    const bankRepository = getRepository(Bank)
    const existingBank = await bankRepository.findOne({ where: { name }, withDeleted: true })
    if (existingBank) {
      if (!existingBank.deleted_at) throw new AppError(constants.errorMessages.existingBank)
      else await bankRepository.restore(existingBank.id)
      return this.assembleBankResponse(existingBank)
    }
    const bank = bankRepository.create({ name })
    await bankRepository.save(bank)
    return this.assembleBankResponse(bank)
  }
}

export default CreateBankService
