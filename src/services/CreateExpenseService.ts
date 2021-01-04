import { startOfDay } from 'date-fns'
import { getCustomRepository } from 'typeorm'
import Expense from '../models/Expense'
import ExpensesRepository from '../repositories/ExpensesRepository'
import AppError from '../errors/AppError'

interface Request {
  owner_id: string,
  description: string,
  date: Date,
  amount: number
}

class CrateExpenseService {
  public async execute ({ owner_id, description, date, amount }: Request): Promise<Expense> {
    const expensesRepository = getCustomRepository(ExpensesRepository)
    const expenseDate = startOfDay(date)
    const isSameExpense = await expensesRepository.findByDescriptionAndDate(description, expenseDate)
    if (isSameExpense) throw new AppError('This expense is already registered')
    const expense = expensesRepository.create({ owner_id, description, date, amount })
    await expensesRepository.save(expense)
    return expense
  }
}

export default CrateExpenseService
