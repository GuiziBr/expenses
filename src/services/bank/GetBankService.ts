import { getRepository, IsNull } from 'typeorm'
import Bank, { PlainObjectBank } from '../../models/Bank'

interface IListBankResponse {
  banks: PlainObjectBank[],
  totalCount: number
}

class GetBankService {
  private parseBank({ id, name, created_at, updated_at }: Bank): PlainObjectBank {
    return { id, name, created_at, updated_at }
  }

  public async list(offset?: number, limit?: number): Promise<IListBankResponse> {
    const banksRepository = getRepository(Bank)
    const [banks, totalCount] = await banksRepository.findAndCount({ where: { deleted_at: IsNull() }, order: { name: 'ASC' }})
    const paginatedBanks = typeof offset === 'number' ? banks.splice(offset, limit || banks.length) : banks
    return {
      banks: paginatedBanks.map(this.parseBank),
      totalCount
    }
  }

  public async getById(id: string): Promise<PlainObjectBank | null> {
    const banksRepository = getRepository(Bank)
    const bank = await banksRepository.findOne({ where: { id, deleted_at: IsNull() }})
    return bank ? this.parseBank(bank) : null
  }
}

export default GetBankService
