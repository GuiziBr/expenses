import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validatePaymentType } from '../middlewares/validateInput'
import PaymentType from '../models/PaymentType'
import CreatePaymentTypeService from '../services/CreatePaymentTypeService'
import UpdatePaymentTypeService from '../services/UpdatePaymentTypeService'

const paymentTypeRouter = Router()

paymentTypeRouter.use(ensureAuthenticated)

paymentTypeRouter.get('/', async (_request, response) => {
  const paymentTypeRepository = getRepository(PaymentType)
  const paymentTypes = await paymentTypeRepository.find()
  return response.json(paymentTypes)
})

paymentTypeRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const paymentTypeRepository = getRepository(PaymentType)
  const paymentType = await paymentTypeRepository.findOne({ where: { id, deleted_at: IsNull() }})
  if (!paymentType) throw new AppError(constants.errorMessages.notFoundPaymentType, 404)
  return response.json(paymentType)
})

paymentTypeRouter.post('/', validatePaymentType, async (request, response) => {
  const { description } = request.body
  const createPaymentType = new CreatePaymentTypeService()
  const paymentType = await createPaymentType.execute({ description })
  return response.status(201).json(paymentType)
})

paymentTypeRouter.patch('/:id', validateId, validatePaymentType, async (request, response) => {
  const { id } = request.params
  const { description } = request.body
  const updatePaymentType = new UpdatePaymentTypeService()
  await updatePaymentType.execute({ id, description })
  return response.status(204).json()
})

paymentTypeRouter.delete('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const paymentTypeRepository = getRepository(PaymentType)
  await paymentTypeRepository.softDelete(id)
  return response.status(204).json()
})

export default paymentTypeRouter
