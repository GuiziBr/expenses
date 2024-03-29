import { format } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import constants from '../constants'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateGetBalance, validateGetSharedBalance } from '../middlewares/validateInput'
import ExpensesRepository from '../repositories/ExpensesRepository'
import ConsolidateSharedExpensesService from '../services/expense/ConsolidateExpensesService'

const balanceRouter = Router()

balanceRouter.use(ensureAuthenticated)

balanceRouter.get('/', validateGetBalance, async ({ user, query }, response) => {
  const { id: owner_id } = user
  const { startDate, endDate, filterBy, filterValue } = query
  const parsedEndDate = endDate?.toString() || format(new Date(), constants.dateFormat)
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const balance = await expensesRepository.getBalance({
    owner_id,
    startDate: startDate?.toString(),
    endDate: parsedEndDate,
    filterBy: filterBy?.toString(),
    filterValue: filterValue?.toString()
  })
  return response.json(balance)
})

balanceRouter.get('/consolidated/:year/:month', validateGetSharedBalance, async ({ user, params }, response) => {
  const { id: owner_id } = user
  const { year, month } = params
  const consolidateSharedExpensesService = new ConsolidateSharedExpensesService()
  const monthValue = Number(month) - 1
  const yearValue = Number(year)
  const SharedBalance = await consolidateSharedExpensesService.consolidate(owner_id, monthValue, yearValue)
  return response.json(SharedBalance)
})

export default balanceRouter
