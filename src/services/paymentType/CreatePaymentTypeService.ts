import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import PaymentType from '../../models/PaymentType'
import { IPaymentType } from '../../domains/paymentType'

class CreatePaymentTypeService {
  private assemblePaymentTypeResponse(paymentType: IPaymentType) {
    return {
      id: paymentType.id,
      description: paymentType.description,
      created_at: paymentType.created_at
    }
  }

  public async execute(description: string): Promise<Omit<IPaymentType, 'updated_at'>> {
    const paymentTypeRepository = getRepository(PaymentType)
    const existingPaymentType = await paymentTypeRepository.findOne({ where: { description }, withDeleted: true })
    if (existingPaymentType) {
      if (!existingPaymentType.deleted_at) throw new AppError(constants.errorMessages.existingPaymentType)
      else await paymentTypeRepository.restore(existingPaymentType.id)
      return this.assemblePaymentTypeResponse(existingPaymentType)
    }
    const paymentType = paymentTypeRepository.create({ description })
    await paymentTypeRepository.save(paymentType)
    return this.assemblePaymentTypeResponse(paymentType)
  }
}

export default CreatePaymentTypeService
