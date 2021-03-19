import { isFuture, startOfDay } from 'date-fns'
import { getCustomRepository, getRepository } from 'typeorm'
import AppError from '../errors/AppError'
import Category from '../models/Category'
import Expense from '../models/Expense'
import ExpensesRepository from '../repositories/ExpensesRepository'

interface Request {
  owner_id: string,
  description: string,
  date: Date,
  amount: number,
  category_id: string
  splitted: boolean
  personal: boolean
}

class CrateExpenseService {
  private async categoryExists(id: string): Promise<boolean> {
    const categoryRepository = getRepository(Category)
    const category = await categoryRepository.findOne({ id })
    return !!category
  }

  private calculateNetAmount(amount: number, personal: boolean, splitted: boolean): number {
    return personal ? amount : (splitted ? Math.round(amount / 2) : amount)
  }

  public async execute({ owner_id, description, date, amount, category_id, splitted, personal }: Request): Promise<Expense> {
    if (!this.categoryExists(category_id)) throw new AppError('Category not found')
    if (isFuture(date)) throw new AppError('Date must not be in the future')
    const expensesRepository = getCustomRepository(ExpensesRepository)
    const expenseDate = startOfDay(date)
    const isSameExpense = await expensesRepository.findByDescriptionAndDate(description, expenseDate)
    if (isSameExpense) throw new AppError('This expense is already registered')
    const netAmount = this.calculateNetAmount(amount, personal, splitted)
    const expense = expensesRepository.create({
      owner_id,
      description,
      date,
      amount: netAmount,
      category_id,
      personal: personal || false,
      splitted: personal ? false : (splitted || false)
    })
    await expensesRepository.save(expense)
    return expense
  }
}

export default CrateExpenseService
