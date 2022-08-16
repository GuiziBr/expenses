import { Router } from 'express'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateListRoutes, validatePaymentType } from '../middlewares/validateInput'
import CreatePaymentTypeService from '../services/paymentType/CreatePaymentTypeService'
import DeletePaymentTypeService from '../services/paymentType/DeletePaymentTypeService'
import GetPaymentTypeService from '../services/paymentType/GetPaymentTypeService'
import UpdatePaymentTypeService from '../services/paymentType/UpdatePaymentTypeService'

const paymentTypeRouter = Router()

paymentTypeRouter.use(ensureAuthenticated)

paymentTypeRouter.get('/', validateListRoutes, async ({ query }, response) => {
  const { offset, limit } = query
  const getPaymentTypeService = new GetPaymentTypeService()
  const { paymentTypes, totalCount } = await getPaymentTypeService.list(Number(offset), Number(limit))
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(paymentTypes)
})

paymentTypeRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const getPaymentTypeService = new GetPaymentTypeService()
  const paymentType = await getPaymentTypeService.getById(id)
  if (!paymentType) throw new AppError(constants.errorMessages.notFoundPaymentType, 404)
  return response.json(paymentType)
})

paymentTypeRouter.post('/', validatePaymentType, async (request, response) => {
  const { description, hasStatement } = request.body
  const createPaymentType = new CreatePaymentTypeService()
  const paymentType = await createPaymentType.execute(description, hasStatement)
  return response.status(201).json(paymentType)
})

paymentTypeRouter.patch('/:id', validateId, validatePaymentType, async (request, response) => {
  const { id } = request.params
  const { description, hasStatement } = request.body
  const updatePaymentType = new UpdatePaymentTypeService()
  await updatePaymentType.execute(id, description, hasStatement)
  return response.status(204).json()
})

paymentTypeRouter.delete('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const deletePaymentTypeService = new DeletePaymentTypeService()
  await deletePaymentTypeService.execute(id)
  return response.status(204).json()
})

export default paymentTypeRouter
