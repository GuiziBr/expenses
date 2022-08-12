import { getRepository } from 'typeorm'
import PaymentType from '../../models/PaymentType'

class DeletePaymentTypeService {
  public async execute(id: string): Promise<void> {
    const paymentTypesRepository = getRepository(PaymentType)
    const existingPaymentType = await paymentTypesRepository.findOne(id)
    if (existingPaymentType && !existingPaymentType.deleted_at) {
      const paymentTypeToDelete = paymentTypesRepository.create({ ...existingPaymentType, deleted_at: new Date() })
      await paymentTypesRepository.save(paymentTypeToDelete)
    }
  }
}

export default DeletePaymentTypeService
