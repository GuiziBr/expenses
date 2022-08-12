import { getRepository } from 'typeorm'
import Bank from '../../models/Bank'

class DeleteBankService {
  public async execute(id: string): Promise<void> {
    const banksRepository = getRepository(Bank)
    const existingBank = await banksRepository.findOne(id)
    if (existingBank && !existingBank.deleted_at) {
      const bankToDelete = banksRepository.create({ ...existingBank, deleted_at: new Date() })
      await banksRepository.save(bankToDelete)
    }
  }
}

export default DeleteBankService
