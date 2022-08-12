import { getRepository, IsNull } from 'typeorm'
import constants from '../../constants'
import Bank, { PlainObjectBank } from '../../models/Bank'

interface IListBankResponse {
  banks: PlainObjectBank[],
  totalCount: number
}

class GetBankService {
  private parseBank({ id, name, created_at, updated_at }: Bank): PlainObjectBank {
    return { id, name, created_at, updated_at }
  }

  public async list(offset = constants.defaultOffset, limit = constants.defaultLimit): Promise<IListBankResponse> {
    const banksRepository = getRepository(Bank)
    const [banks, totalCount] = await banksRepository.findAndCount({ where: { deleted_at: IsNull() }})
    const paginatedBanks = banks.splice(Number(offset), Number(limit) || banks.length)
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
