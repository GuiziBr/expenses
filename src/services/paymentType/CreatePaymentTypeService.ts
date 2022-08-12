import { getRepository } from 'typeorm'
import { paymentTypeAssembleUser } from '../../assemblers/paymentTypeAssembler'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import PaymentType, { TPaymentType } from '../../models/PaymentType'

class CreatePaymentTypeService {
  private async reactivatePaymentType(paymentTypeToRestore: PaymentType): Promise<void> {
    const paymentTypesRepository = getRepository(PaymentType)
    await paymentTypesRepository.save({ ...paymentTypeToRestore, deleted_at: null })
  }

  public async execute(description: string, hasStatement: boolean): Promise<TPaymentType> {
    const paymentTypeRepository = getRepository(PaymentType)
    const existingPaymentType = await paymentTypeRepository.findOne({ where: { description }, withDeleted: true })
    if (existingPaymentType) {
      if (!existingPaymentType.deleted_at) throw new AppError(constants.errorMessages.existingPaymentType)
      else await this.reactivatePaymentType(existingPaymentType)
      return paymentTypeAssembleUser(existingPaymentType)
    }
    const paymentType = paymentTypeRepository.create({ description, hasStatement })
    await paymentTypeRepository.save(paymentType)
    return paymentTypeAssembleUser(paymentType)
  }
}

export default CreatePaymentTypeService
