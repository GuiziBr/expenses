import { getRepository } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import PaymentType from '../models/PaymentType'

interface IPaymentType {
  id: string
  description: string
  created_at: Date
  updated_at: Date
}

interface IRequest {
  id: string,
  description: string
}

class UpdatePaymentTypeService {
  public async execute({ id, description }: IRequest): Promise<IPaymentType> {
    const paymentTypeRepository = getRepository(PaymentType)
    const [paymentType, sameDescriptionPaymentType] = await Promise.all([
      paymentTypeRepository.findOne(id),
      paymentTypeRepository.findOne({ where: { description }})
    ])
    if (!paymentType) throw new AppError(constants.errorMessages.notFoundPaymentType, 404)
    if (sameDescriptionPaymentType && sameDescriptionPaymentType.id !== id) {
      throw new AppError(constants.errorMessages.duplicatedPaymentTypeDescription, 400)
    }
    const updatedPaymentType = await paymentTypeRepository.save({
      ...paymentType,
      description,
      updated_at: new Date()
    })
    return {
      id: updatedPaymentType.id,
      description: updatedPaymentType.description,
      created_at: updatedPaymentType.created_at,
      updated_at: updatedPaymentType.updated_at
    }
  }
}

export default UpdatePaymentTypeService
