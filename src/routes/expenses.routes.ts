import { parseISO } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import constants from '../constants'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { parseBodyDate } from '../middlewares/parseDate'
import { validateExpense, validateGetBalance } from '../middlewares/validateInput'
import ExpensesRepository from '../repositories/ExpensesRepository'
import CreateExpenseService from '../services/CreateExpenseService'

const expensesRouter = Router()

expensesRouter.use(ensureAuthenticated)

expensesRouter.post('/', validateExpense, parseBodyDate, async ({ user, body }, response) => {
  const { id: owner_id } = user
  const { description, date, amount, category_id, personal, split } = body
  const createExpense = new CreateExpenseService()
  const expense = await createExpense.execute({
    owner_id,
    category_id,
    description,
    date,
    amount: Math.round(amount * 100),
    personal,
    split
  })
  return response.json(expense)
})

expensesRouter.get('/balance', validateGetBalance, async ({ user, query }, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = user
  const { date, offset, limit } = query
  const parsedDate = date ? parseISO(date.toString()) : new Date()
  const currentBalance = await expensesRepository.getCurrentBalance({
    owner_id,
    date: parsedDate,
    offset: Number(offset),
    limit: Number(limit)
  })
  response.setHeader(constants.headerTypes.totalCount, currentBalance.totalCount)
  return response.json(currentBalance)
})

expensesRouter.get('/personalBalance', validateGetBalance, async ({ user, query }, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = user
  const { date, offset, limit } = query
  const parsedDate = date ? parseISO(date.toString()) : new Date()
  const { personalBalance, totalCount } = await expensesRepository.getPersonalExpenses({
    owner_id,
    date: parsedDate,
    offset: Number(offset),
    limit: Number(limit)
  })
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(personalBalance)
})

export default expensesRouter
