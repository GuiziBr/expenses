import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validatePaymentType } from '../middlewares/validateInput'
import PaymentType from '../models/PaymentType'
import CreatePaymentTypeService from '../services/CreatePaymentTypeService'

const paymentTypeRouter = Router()

paymentTypeRouter.use(ensureAuthenticated)

paymentTypeRouter.get('/', async (_request, response) => {
  const paymentTypeRepository = getRepository(PaymentType)
  const paymentTypes = await paymentTypeRepository.find({ where: { deleted_at: IsNull() }})
  return response.json(paymentTypes)
})

paymentTypeRouter.post('/', validatePaymentType, async (request, response) => {
  const { description } = request.body
  const cratePaymentType = new CreatePaymentTypeService()
  const paymentType = await cratePaymentType.execute({ description })
  return response.status(201).json(paymentType)
})

export default paymentTypeRouter
