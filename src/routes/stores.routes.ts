import { Router } from 'express'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateListRoutes, validateName } from '../middlewares/validateInput'
import CreateStoreService from '../services/store/CreateStoreService'
import DeleteStoreService from '../services/store/DeleteStoreService'
import GetStoreService from '../services/store/GetStoreService'
import UpdateStoreService from '../services/store/UpdateStoreService'

const storesRouter = Router()

storesRouter.use(ensureAuthenticated)

storesRouter.get('/', validateListRoutes, async ({ query }, response) => {
  const { offset, limit } = query
  const getStoreService = new GetStoreService()
  const { stores, totalCount } = await getStoreService.list(Number(offset), Number(limit))
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(stores)
})

storesRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const getStoreService = new GetStoreService()
  const store = await getStoreService.getById(id)
  if (!store) throw new AppError(constants.errorMessages.notFoundStore, 404)
  return response.json(store)
})

storesRouter.patch('/:id', validateId, validateName, async (request, response) => {
  const { id } = request.params
  const { name } = request.body
  const updateStore = new UpdateStoreService()
  await updateStore.execute(id, name)
  return response.status(204).json()
})

storesRouter.post('/', validateName, async (request, response) => {
  const { name } = request.body
  const createStore = new CreateStoreService()
  const bank = await createStore.execute(name)
  return response.status(201).json(bank)
})

storesRouter.delete('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const deleteStoreService = new DeleteStoreService()
  await deleteStoreService.execute(id)
  return response.status(204).json()
})

export default storesRouter
