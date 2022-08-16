import { Router } from 'express'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateListRoutes, validateName } from '../middlewares/validateInput'
import CreateBankService from '../services/bank/CreateBankService'
import DeleteBankService from '../services/bank/DeleteBankService'
import GetBankService from '../services/bank/GetBankService'
import UpdateBankService from '../services/bank/UpdateBankService'

const banksRouter = Router()

banksRouter.use(ensureAuthenticated)

banksRouter.get('/', validateListRoutes, async ({ query }, response) => {
  const { offset, limit } = query
  const getBankService = new GetBankService()
  const { banks, totalCount } = await getBankService.list(Number(offset), Number(limit))
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(banks)
})

banksRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const getBankService = new GetBankService()
  const bank = await getBankService.getById(id)
  if (!bank) throw new AppError(constants.errorMessages.notFoundBank, 404)
  return response.json(bank)
})

banksRouter.patch('/:id', validateId, validateName, async (request, response) => {
  const { id } = request.params
  const { name } = request.body
  const updateBank = new UpdateBankService()
  await updateBank.execute(id, name)
  return response.status(204).json()
})

banksRouter.post('/', validateName, async (request, response) => {
  const { name } = request.body
  const createBank = new CreateBankService()
  const bank = await createBank.execute(name)
  return response.status(201).json(bank)
})

banksRouter.delete('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const deleteBankService = new DeleteBankService()
  await deleteBankService.execute(id)
  return response.status(204).json()
})

export default banksRouter
