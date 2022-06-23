import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateDescription } from '../middlewares/validateInput'
import PaymentType from '../models/PaymentType'
import CreatePaymentTypeService from '../services/paymentType/CreatePaymentTypeService'
import UpdatePaymentTypeService from '../services/paymentType/UpdatePaymentTypeService'
import { paymentTypeAssembleUser } from '../assemblers/paymentTypeAssembler'

const paymentTypeRouter = Router()

paymentTypeRouter.use(ensureAuthenticated)

paymentTypeRouter.get('/', async (_request, response) => {
  const paymentTypesRepository = getRepository(PaymentType)
  const paymentTypes = await paymentTypesRepository.find()
  return response.json(paymentTypes.map(paymentTypeAssembleUser))
})

paymentTypeRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const paymentTypesRepository = getRepository(PaymentType)
  const paymentType = await paymentTypesRepository.findOne({ where: { id, deleted_at: IsNull() }})
  if (!paymentType) throw new AppError(constants.errorMessages.notFoundPaymentType, 404)
  return response.json(paymentTypeAssembleUser(paymentType))
})

paymentTypeRouter.post('/', validateDescription, async (request, response) => {
  const { description } = request.body
  const createPaymentType = new CreatePaymentTypeService()
  const paymentType = await createPaymentType.execute(description)
  return response.status(201).json(paymentType)
})

paymentTypeRouter.patch('/:id', validateId, validateDescription, async (request, response) => {
  const { id } = request.params
  const { description } = request.body
  const updatePaymentType = new UpdatePaymentTypeService()
  await updatePaymentType.execute(id, description)
  return response.status(204).json()
})

paymentTypeRouter.delete('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const paymentTypesRepository = getRepository(PaymentType)
  const existingPaymentType = await paymentTypesRepository.findOne(id)
  if (!existingPaymentType || existingPaymentType.deleted_at) return response.status(204).json()
  await paymentTypesRepository.update(id, { deleted_at: new Date() })
  return response.status(204).json()
})

export default paymentTypeRouter
