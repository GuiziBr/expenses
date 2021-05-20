import { isFuture, startOfDay } from 'date-fns'
import { EntityTarget, getCustomRepository, getRepository, Entity } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import Category from '../models/Category'
import PaymentType from '../models/PaymentType'
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
  payment_type_id: string
}

class CrateExpenseService {
  private async checkIfParameterExists(id: string, model: EntityTarget<typeof Entity>): Promise<boolean> {
    const repository = getRepository(model)
    const parameter = await repository.findOne({ id })
    return !!parameter
  }

  private calculateNetAmount(amount: number, personal: boolean, split: boolean): number {
    return personal ? amount : (split ? Math.round(amount / 2) : amount)
  }

  public async execute({ owner_id, description, date, amount, category_id, personal, split, payment_type_id }: Request): Promise<Expense> {
    if (!await this.checkIfParameterExists(category_id, Category)) throw new AppError(constants.errorMessages.notFoundCategory)
    if (!await this.checkIfParameterExists(payment_type_id, PaymentType)) throw new AppError(constants.errorMessages.notFoundPaymentType)
    if (isFuture(date)) throw new AppError(constants.errorMessages.futureDate)
    const expensesRepository = getCustomRepository(ExpensesRepository)
    const isSameExpense = await expensesRepository.findByDescriptionAndDate(description, startOfDay(date))
    if (isSameExpense) throw new AppError(constants.errorMessages.existingExpense)
    const netAmount = this.calculateNetAmount(amount, personal, split)
    const expense = expensesRepository.create({
      owner_id,
      description,
      date,
      amount: netAmount,
      category_id,
      personal: personal || false,
      split: personal ? false : (split || false),
      payment_type_id
    })
    await expensesRepository.save(expense)
    return expense
  }
}

export default CrateExpenseService
