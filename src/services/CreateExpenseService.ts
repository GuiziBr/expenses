import { isFuture, startOfDay } from 'date-fns'
import { getCustomRepository, getRepository } from 'typeorm'
import constants from '../constants'
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
  personal: boolean
  split: boolean
}

class CrateExpenseService {
  private async categoryExists(id: string): Promise<boolean> {
    const categoryRepository = getRepository(Category)
    const category = await categoryRepository.findOne({ id })
    return !!category
  }

  private calculateNetAmount(amount: number, personal: boolean, split: boolean): number {
    return personal ? amount : (split ? Math.round(amount / 2) : amount)
  }

  public async execute({ owner_id, description, date, amount, category_id, personal, split }: Request): Promise<Expense> {
    if (!this.categoryExists(category_id)) throw new AppError(constants.errorMessages.notFoundCategory)
    if (isFuture(date)) throw new AppError(constants.errorMessages.futureDate)
    const expensesRepository = getCustomRepository(ExpensesRepository)
    const expenseDate = startOfDay(date)
    const isSameExpense = await expensesRepository.findByDescriptionAndDate(description, expenseDate)
    if (isSameExpense) throw new AppError(constants.errorMessages.existingExpense)
    const netAmount = this.calculateNetAmount(amount, personal, split)
    const expense = expensesRepository.create({
      owner_id,
      description,
      date,
      amount: netAmount,
      category_id,
      personal: personal || false,
      split: personal ? false : (split || false)
    })
    await expensesRepository.save(expense)
    return expense
  }
}

export default CrateExpenseService
