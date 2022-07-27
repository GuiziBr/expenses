import { parseISO } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateGetBalance, validateGetConsolidatedBalance } from '../middlewares/validateInput'
import ExpensesRepository from '../repositories/ExpensesRepository'
import ConsolidateExpensesService from '../services/expense/ConsolidateExpensesService'

const balanceRouter = Router()

balanceRouter.use(ensureAuthenticated)

balanceRouter.get('/', validateGetBalance, async ({ user, query }, response) => {
  const { id: owner_id } = user
  const { startDate, endDate } = query
  const parsedStartDate = startDate ? parseISO(startDate.toString()) : null
  const parsedEndDate = endDate ? parseISO(endDate.toString()) : new Date()
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const balance = await expensesRepository.getBalance({ owner_id, startDate: parsedStartDate, endDate: parsedEndDate })
  return response.json(balance)
})

balanceRouter.get('/consolidated/:month', validateGetConsolidatedBalance, async ({ user, params }, response) => {
  const { id: owner_id } = user
  const { month } = params
  const consolidateExpensesService = new ConsolidateExpensesService()
  const monthValue = Number(month) - 1
  const consolidatedBalance = await consolidateExpensesService.consolidate(owner_id, monthValue)
  return response.json(consolidatedBalance)
})

export default balanceRouter
