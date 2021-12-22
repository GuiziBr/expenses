import { getRepository } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import PaymentType from '../models/PaymentType'

interface IPaymentType {
  id: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
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
    return paymentType
  }
}

export default CreatePaymentTypeService
