import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { parseBodyDate, validateQueryDate } from '../middlewares/validateDate'
import ExpensesRepository from '../repositories/ExpensesRepository'
import CreateExpenseService from '../services/CreateExpenseService'

const expensesRouter = Router()

expensesRouter.use(ensureAuthenticated)

expensesRouter.post('/', parseBodyDate, async (request, response) => {
  const { description, date, amount, category_id, shared } = request.body
  const { id: owner_id } = request.user
  const createExpense = new CreateExpenseService()
  const expense = await createExpense.execute({ owner_id, category_id, description, date, amount: Math.round(amount * 100), shared })
  return response.json(expense)
})

expensesRouter.get('/balance', validateQueryDate, async (request, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = request.user
  const { date } = request.query
  const parsedDate = date ? parseISO(date.toString()) : new Date()
  const currentBalance = await expensesRepository.getCurrentBalance({ owner_id, date: parsedDate })
  return response.json(currentBalance)
})

export default expensesRouter
