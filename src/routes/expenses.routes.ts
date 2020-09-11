import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import ExpensesRepository from '../repositories/ExpensesRepository'
import CreateExpenseService from '../services/CreateExpenseService'

const expensesRouter = Router()

expensesRouter.use(ensureAuthenticated)

expensesRouter.post('/', async (request, response) => {
  try {
    const { description, date, amount } = request.body
    const { id: owner_id } = request.user
    const parsedDate = parseISO(date)
    const createExpense = new CreateExpenseService()
    const expense = await createExpense.execute({ owner_id, description, date: parsedDate, amount })
    return response.json(expense)
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

expensesRouter.get('/balance', async (request, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = request.user
  const currentBalance = await expensesRepository.getCurrentBalance(owner_id)
  return response.json(currentBalance)
})

export default expensesRouter
