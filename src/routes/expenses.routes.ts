import { parseISO } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { parseBodyDate, validateQueryDate } from '../middlewares/validateDate'
import { validateExpense } from '../middlewares/validateInput'
import ExpensesRepository from '../repositories/ExpensesRepository'
import CreateExpenseService from '../services/CreateExpenseService'

const expensesRouter = Router()

expensesRouter.use(ensureAuthenticated)

expensesRouter.post('/', validateExpense, parseBodyDate, async (request, response) => {
  const { description, date, amount, category_id, personal, splitted } = request.body
  const { id: owner_id } = request.user
  const createExpense = new CreateExpenseService()
  const expense = await createExpense.execute({
    owner_id,
    category_id,
    description,
    date,
    amount: Math.round(amount * 100),
    personal,
    splitted
  })
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

expensesRouter.get('/personalBalance', validateQueryDate, async (request, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = request.user
  const { date } = request.query
  const parsedDate = date ? parseISO(date.toString()) : new Date()
  const personalBalance = await expensesRepository.getPersonalExpenses({ owner_id, date: parsedDate })
  return response.json(personalBalance)
})

export default expensesRouter
