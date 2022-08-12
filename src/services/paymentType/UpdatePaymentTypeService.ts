import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import PaymentType from '../../models/PaymentType'

class UpdatePaymentTypeService {
  private async reactivate(paymentTypeIdToDelete: string, paymentTypeIdToRestore: string): Promise<PaymentType | null> {
    const paymentTypesRepository = getRepository(PaymentType)

    const paymentTypeToDelete = paymentTypesRepository.create({ id: paymentTypeIdToDelete, deleted_at: new Date() })
    const paymentTypeToReactivate = paymentTypesRepository.create({ id: paymentTypeIdToRestore, deleted_at: null })

    await Promise.all([
      paymentTypesRepository.save(paymentTypeToDelete),
      paymentTypesRepository.save(paymentTypeToReactivate)
    ])

    return paymentTypeToReactivate
  }

  public async execute(id: string, description: string, hasStatement?: boolean): Promise<void> {
    const paymentTypeRepository = getRepository(PaymentType)

    const [paymentType, sameDescriptionPaymentType] = await Promise.all([
      paymentTypeRepository.findOne(id),
      paymentTypeRepository.findOne({ where: { description }, withDeleted: true })
    ])

    if (!paymentType) throw new AppError(constants.errorMessages.notFoundCategory, 404)

    if ((paymentType && !sameDescriptionPaymentType) || (sameDescriptionPaymentType?.id === id)) {
      const paymentTypeToUpdate = paymentTypeRepository.create({
        ...paymentType,
        description,
        hasStatement,
        updated_at: new Date()
      })
      await paymentTypeRepository.save(paymentTypeToUpdate)
      return
    }
    if (sameDescriptionPaymentType) {
      if (!sameDescriptionPaymentType?.deleted_at) {
        throw new AppError(constants.errorMessages.duplicatedPaymentTypeDescription, 400)
      }
      const reactivatedPaymentType = await this.reactivate(id, sameDescriptionPaymentType.id)
      if (!reactivatedPaymentType) throw new AppError(constants.errorMessages.internalError, 500)
    }
  }
}

export default UpdatePaymentTypeService
