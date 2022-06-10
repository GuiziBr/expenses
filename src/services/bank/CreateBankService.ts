import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IBank } from '../../domains/bank'
import AppError from '../../errors/AppError'
import Bank from '../../models/Bank'

class CreateBankService {
  public async execute(name: string): Promise<Omit<IBank, 'updated_at'>> {
    const bankRepository = getRepository(Bank)
    const bankExists = await bankRepository.findOne({ where: { name }})
    if (bankExists) throw new AppError(constants.errorMessages.existingBank)
    const bank = bankRepository.create({ name })
    await bankRepository.save(bank)
    return {
      id: bank.id,
      name: bank.name,
      created_at: bank.created_at
    }
  }
}

export default CreateBankService
