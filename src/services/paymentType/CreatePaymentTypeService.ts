import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import PaymentType, { PlainObjectPaymentType } from '../../models/PaymentType'

class CreatePaymentTypeService {
  private async reactivatePaymentType(paymentTypeToRestore: PaymentType): Promise<void> {
    const paymentTypesRepository = getRepository(PaymentType)
    await paymentTypesRepository.save({ ...paymentTypeToRestore, deleted_at: null })
  }

  private parsePaymentType({ id, description, created_at, updated_at, hasStatement }: PaymentType): PlainObjectPaymentType {
    return { id, description, created_at, updated_at, hasStatement }
  }

  public async execute(description: string, hasStatement: boolean): Promise<PlainObjectPaymentType> {
    const paymentTypeRepository = getRepository(PaymentType)
    const existingPaymentType = await paymentTypeRepository.findOne({ where: { description }, withDeleted: true })
    if (existingPaymentType) {
      if (!existingPaymentType.deleted_at) throw new AppError(constants.errorMessages.existingPaymentType)
      else await this.reactivatePaymentType(existingPaymentType)
      return this.parsePaymentType(existingPaymentType)
    }
    const paymentType = paymentTypeRepository.create({ description, hasStatement })
    await paymentTypeRepository.save(paymentType)
    return this.parsePaymentType(paymentType)
  }
}

export default CreatePaymentTypeService
