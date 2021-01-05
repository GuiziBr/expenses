import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import ExpensesRepository from '../repositories/ExpensesRepository'
import CreateExpenseService from '../services/CreateExpenseService'

const expensesRouter = Router()

expensesRouter.use(ensureAuthenticated)

expensesRouter.post('/', async (request, response) => {
  const { description, date, amount } = request.body
  const { id: owner_id } = request.user
  const parsedDate = parseISO(date)
  const createExpense = new CreateExpenseService()
  const expense = await createExpense.execute({ owner_id, description, date: parsedDate, amount: Math.round(amount * 100) })
  return response.json(expense)
})

expensesRouter.get('/balance', async (request, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = request.user
  const currentBalance = await expensesRepository.getCurrentBalance(owner_id)
  return response.json(currentBalance)
})

export default expensesRouter
