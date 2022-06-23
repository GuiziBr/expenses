import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import { bankAssembleUser } from '../assemblers/bankAssembler'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateName } from '../middlewares/validateInput'
import Bank from '../models/Bank'
import CreateBankService from '../services/bank/CreateBankService'
import UpdateBankService from '../services/bank/UpdateBankService'

const banksRouter = Router()

banksRouter.use(ensureAuthenticated)

banksRouter.get('/', async (_request, response) => {
  const banksRepository = getRepository(Bank)
  const banks = await banksRepository.find({ where: { deleted_at: IsNull() }})
  return response.json(banks.map(bankAssembleUser))
})

banksRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const banksRepository = getRepository(Bank)
  const bank = await banksRepository.findOne({ where: { id, deleted_at: IsNull() }})
  if (!bank) throw new AppError(constants.errorMessages.notFoundBank, 404)
  return response.json(bankAssembleUser(bank))
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
  const banksRepository = getRepository(Bank)
  const existingBank = await banksRepository.findOne(id)
  if (!existingBank || existingBank.deleted_at) return response.status(204).json()
  await banksRepository.update(id, { deleted_at: new Date() })
  return response.status(204).json()
})

export default banksRouter
