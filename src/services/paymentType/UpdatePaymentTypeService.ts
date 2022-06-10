import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IRequest } from '../../domains/paymentType'
import AppError from '../../errors/AppError'
import PaymentType from '../../models/PaymentType'

class UpdatePaymentTypeService {
  private async reactivate(paymentTypeIdToDelete: string, paymentTypeIdToRestore: string): Promise<PaymentType | null> {
    const paymentTypeRepository = getRepository(PaymentType)
    await Promise.all([
      paymentTypeRepository.softDelete(paymentTypeIdToDelete),
      paymentTypeRepository.restore(paymentTypeIdToRestore)
    ])
    const paymentType = await paymentTypeRepository.findOne(paymentTypeIdToRestore)
    return paymentType || null
  }

  public async execute({ id, description }: IRequest): Promise<void> {
    const paymentTypeRepository = getRepository(PaymentType)

    const [paymentType, sameDescriptionPaymentType] = await Promise.all([
      paymentTypeRepository.findOne(id),
      paymentTypeRepository.findOne({ where: { description }, withDeleted: true })
    ])

    if (!paymentType) throw new AppError(constants.errorMessages.notFoundCategory, 404)

    if ((paymentType && !sameDescriptionPaymentType) || (sameDescriptionPaymentType?.id === id)) {
      await paymentTypeRepository.save({
        ...paymentType,
        description,
        updated_at: new Date()
      })
    }

    if (!sameDescriptionPaymentType?.deleted_at) {
      throw new AppError(constants.errorMessages.duplicatedPaymentTypeDescription, 400)
    }

    const reactivatedPaymentType = await this.reactivate(id, sameDescriptionPaymentType.id)

    if (!reactivatedPaymentType) throw new AppError(constants.errorMessages.internalError, 500)
  }
}

export default UpdatePaymentTypeService
