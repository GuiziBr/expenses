import { startOfDay, isFuture } from 'date-fns'
import { getCustomRepository, getRepository } from 'typeorm'
import Expense from '../models/Expense'
import Category from '../models/Category'
import ExpensesRepository from '../repositories/ExpensesRepository'
import AppError from '../errors/AppError'

interface Request {
  owner_id: string,
  description: string,
  date: Date,
  amount: number,
  category_id: string
}

class CrateExpenseService {
  public async execute ({ owner_id, description, date, amount, category_id }: Request): Promise<Expense> {
    const categoryRepository = getRepository(Category)
    const category = await categoryRepository.findOne({ id: category_id })
    if (!category) throw new AppError('Category not found')
    if (isFuture(date)) throw new AppError('Date must not be in the future')
    const expensesRepository = getCustomRepository(ExpensesRepository)
    const expenseDate = startOfDay(date)
    const isSameExpense = await expensesRepository.findByDescriptionAndDate(description, expenseDate)
    if (isSameExpense) throw new AppError('This expense is already registered')
    const expense = expensesRepository.create({ owner_id, description, date, amount, category_id })
    await expensesRepository.save(expense)
    return expense
  }
}

export default CrateExpenseService
