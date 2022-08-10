import { format } from 'date-fns'
import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import constants from '../constants'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { parseBodyDate } from '../middlewares/parseDate'
import { validateCreateExpense, validateGetExpenses } from '../middlewares/validateInput'
import ExpensesRepository from '../repositories/ExpensesRepository'
import CreateExpenseService from '../services/expense/CreateExpenseService'

const expensesRouter = Router()

expensesRouter.use(ensureAuthenticated)

expensesRouter.post('/', validateCreateExpense, parseBodyDate, async ({ user, body }, response) => {
  const { id: owner_id } = user
  const { description, date, amount, category_id, personal, split, payment_type_id, bank_id, store_id } = body
  const createExpense = new CreateExpenseService()
  const expense = await createExpense.execute({
    owner_id,
    category_id,
    description,
    date,
    amount: Math.round(amount * 100),
    personal,
    split,
    payment_type_id,
    bank_id,
    store_id
  })
  return response.status(201).json(expense)
})

expensesRouter.get('/shared', validateGetExpenses, async ({ user, query }, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = user
  const {
    startDate,
    endDate,
    offset = constants.defaultOffset,
    limit = constants.defaultLimit,
    orderBy,
    orderType,
    filterBy,
    filterValue
  } = query
  const parsedEndDate = endDate?.toString() || format(new Date(), constants.dateFormat)
  const parsedOrderType = !orderType || orderType === 'asc' ? 'asc' : 'desc'
  const { expenses, totalCount } = await expensesRepository.getSharedExpenses({
    owner_id,
    startDate: startDate?.toString(),
    endDate: parsedEndDate,
    offset: Number(offset),
    limit: Number(limit),
    orderBy: orderBy?.toString(),
    orderType: parsedOrderType,
    filterBy: filterBy?.toString(),
    filterValue: filterValue?.toString()
  })
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(expenses)
})

expensesRouter.get('/personal', validateGetExpenses, async ({ user, query }, response) => {
  const expensesRepository = getCustomRepository(ExpensesRepository)
  const { id: owner_id } = user
  const {
    startDate,
    endDate,
    offset = constants.defaultOffset,
    limit = constants.defaultLimit,
    orderBy, orderType,
    filterBy,
    filterValue
  } = query
  const parsedEndDate = endDate?.toString() || format(new Date(), constants.dateFormat)
  const parsedOrderType = !orderType || orderType === 'asc' ? 'asc' : 'desc'
  const { expenses, totalCount } = await expensesRepository.getPersonalExpenses({
    owner_id,
    startDate: startDate?.toString(),
    endDate: parsedEndDate,
    offset: Number(offset),
    limit: Number(limit),
    orderBy: orderBy?.toString(),
    orderType: parsedOrderType,
    filterBy: filterBy?.toString(),
    filterValue: filterValue?.toString()
  })
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(expenses)
})

export default expensesRouter
