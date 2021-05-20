import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'
import PaymentType from '../../models/PaymentType'
import CreatePaymentTypeService from '../../services/CreatePaymentTypeService'

export class ChangePaymentTypeField1621475466451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const paymentTypeRepository = getRepository(PaymentType)
    let paymentTypes = await paymentTypeRepository.findOne({ where: { description: 'Vale Refeição' }})
    if (!paymentTypes) {
      const createPaymentType = new CreatePaymentTypeService()
      paymentTypes = await createPaymentType.execute({ description: 'Vale Refeição' })
    }
    await queryRunner.query(`UPDATE public.expenses SET payment_type_id = '${paymentTypes.id}'`)
    await queryRunner.query('ALTER TABLE public.expenses ALTER COLUMN payment_type_id SET NOT NULL;')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE public.expenses ALTER COLUMN payment_type_id DROP NOT NULL;')
  }
}
