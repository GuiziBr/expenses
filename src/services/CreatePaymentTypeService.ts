import { getRepository } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import PaymentType from '../models/PaymentType'

interface IPaymentType {
  id: string
  description: string
  created_at: Date
}

interface IRequest {
  description: string
}

class CreatePaymentTypeService {
  public async execute({ description }: IRequest): Promise<IPaymentType> {
    const paymentTypeRepository = getRepository(PaymentType)
    const paymentTypeExists = await paymentTypeRepository.findOne({ where: { description }})
    if (paymentTypeExists) throw new AppError(constants.errorMessages.existingPaymentType)
    const paymentType = paymentTypeRepository.create({ description })
    await paymentTypeRepository.save(paymentType)
    return {
      id: paymentType.id,
      description: paymentType.description,
      created_at: paymentType.created_at
    }
  }
}

export default CreatePaymentTypeService
