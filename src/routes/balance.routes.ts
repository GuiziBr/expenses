import { parseISO } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateGetBalance } from '../middlewares/validateInput'
import ExpensesRepository from '../repositories/ExpensesRepository'

const balanceRouter = Router()

balanceRouter.use(ensureAuthenticated)

balanceRouter.get('/', validateGetBalance, async ({ user, query }, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = user
  const { startDate, endDate } = query
  const parsedStartDate = startDate ? parseISO(startDate.toString()) : null
  const parsedEndDate = endDate ? parseISO(endDate.toString()) : new Date()
  const balance = await expensesRepository.getBalance({ owner_id, startDate: parsedStartDate, endDate: parsedEndDate })
  return response.json(balance)
})

export default balanceRouter
