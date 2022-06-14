import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateName } from '../middlewares/validateInput'
import Store from '../models/Store'
import CreateStoreService from '../services/store/CreateStoreService'
import UpdateStoreService from '../services/store/UpdateStoreService'

const storesRouter = Router()

storesRouter.use(ensureAuthenticated)

storesRouter.get('/', async (_request, response) => {
  const storesRepository = getRepository(Store)
  const stores = await storesRepository.find()
  return response.json(stores)
})

storesRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const storesRepository = getRepository(Store)
  const store = await storesRepository.findOne({ where: { id, deleted_at: IsNull() }})
  if (!store) throw new AppError(constants.errorMessages.notFoundStore)
  return response.json(store)
})

storesRouter.patch('/:id', validateId, validateName, async (request, response) => {
  const { id } = request.params
  const { name } = request.body
  const updateStore = new UpdateStoreService()
  await updateStore.execute({ id, name })
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
  const storeTypeRepository = getRepository(Store)
  await storeTypeRepository.softDelete(id)
  return response.status(204).json()
})

export default storesRouter
