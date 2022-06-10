import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateId, validateBank } from '../middlewares/validateInput'
import Bank from '../models/Bank'
import CreateBankService from '../services/bank/CreateBankService'

const banksRouter = Router()

banksRouter.use(ensureAuthenticated)

banksRouter.get('/', async (_request, response) => {
  const banksRepository = getRepository(Bank)
  const banks = await banksRepository.find()
  return response.json(banks)
})

banksRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const banksRepository = getRepository(Bank)
  const bank = await banksRepository.findOne({ where: { id, deleted_at: IsNull() }})
  if (!bank) throw new AppError(constants.errorMessages.notFoundBank, 404)
  return response.json(bank)
})

banksRouter.post('/', validateBank, async (request, response) => {
  const { name } = request.body
  const createBank = new CreateBankService()
  const bank = await createBank.execute(name)
  return response.status(201).json(bank)
})

export default banksRouter
