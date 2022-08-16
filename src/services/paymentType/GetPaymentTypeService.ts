import { getRepository, IsNull } from 'typeorm'
import constants from '../../constants'
import Bank, { PlainObjectPaymentType } from '../../models/PaymentType'

interface IListPaymentTypeResponse {
  paymentTypes: PlainObjectPaymentType[],
  totalCount: number
}

class GetPaymentTypeService {
  private parsePaymentType({ id, description, created_at, updated_at, hasStatement }: Bank): PlainObjectPaymentType {
    return { id, description, created_at, updated_at, hasStatement }
  }

  public async list(offset?: number, limit?: number): Promise<IListPaymentTypeResponse> {
    const paymentTypesRepository = getRepository(Bank)
    const [paymentTypes, totalCount] = await paymentTypesRepository.findAndCount({
      where: { deleted_at: IsNull() },
      order: { description: 'ASC' }
    })
    const paginatedPaymentTypes = typeof offset === 'number' ? paymentTypes.splice(offset, limit || paymentTypes.length) : paymentTypes
    return {
      paymentTypes: paginatedPaymentTypes.map(this.parsePaymentType),
      totalCount
    }
  }

  public async getById(id: string): Promise<PlainObjectPaymentType | null> {
    const paymentTypesRepository = getRepository(Bank)
    const paymentType = await paymentTypesRepository.findOne({ where: { id, deleted_at: IsNull() }})
    return paymentType ? this.parsePaymentType(paymentType) : null
  }
}

export default GetPaymentTypeService
