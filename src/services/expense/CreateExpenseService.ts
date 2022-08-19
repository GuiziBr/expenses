import { addMonths, endOfMonth, getMonth, getYear, isFuture, setDate, startOfDay } from 'date-fns'
import { Entity, EntityTarget, getCustomRepository, getRepository, IsNull } from 'typeorm'
import constants from '../../constants'
import { ICreateExpenseRequest } from '../../domains/request'
import AppError from '../../errors/AppError'
import Bank from '../../models/Bank'
import Category from '../../models/Category'
import Expense from '../../models/Expense'
import PaymentType from '../../models/PaymentType'
import StatementPeriod from '../../models/StatementPeriod'
import Store from '../../models/Store'
import ExpensesRepository from '../../repositories/ExpensesRepository'

interface ICalculateDueDate {
  transactionDate: Date
  paymentTypeId: string | undefined
  userId: string
  bankId: string | undefined
}

class CrateExpenseService {
  private async checkIfParameterExists(id: string, model: EntityTarget<typeof Entity>): Promise<boolean> {
    const repository = getRepository(model)
    const parameter = await repository.findOne({ where: { id, deleted_at: IsNull() }})
    return !!parameter
  }

  private calculateNetAmount(amount: number, personal: boolean, split: boolean): number {
    return personal ? amount : (split ? Math.round(amount / 2) : amount)
  }

  private async calculateDueDate({ transactionDate, paymentTypeId, userId, bankId }: ICalculateDueDate): Promise<Date> {
    if (!paymentTypeId) return transactionDate

    const paymentTypeRepository = getRepository(PaymentType)
    const paymentType = await paymentTypeRepository.findOne(paymentTypeId)
    if (paymentType?.hasStatement && !bankId) throw new AppError(constants.errorMessages.paymentTypeStatementWithNoBank)

    if (!paymentType?.hasStatement) return addMonths(transactionDate, 1)

    const statementPeriodRepository = getRepository(StatementPeriod)
    const statementPeriod = await statementPeriodRepository.findOne({ where: { user_id: userId, bank_id: bankId }})
    if (!statementPeriod) throw new AppError(constants.errorMessages.statementPeriodNotFound)

    const { initial_day: initialDay, final_day: finalDay } = statementPeriod
    const lastDayOfMonth = endOfMonth(transactionDate).getDate()
    const transactionNextMonth = getMonth(transactionDate) + 1
    const statementInitialDate = setDate(transactionDate, Number(initialDay))

    return transactionDate < statementInitialDate
      ? setDate(transactionDate, Number(lastDayOfMonth))
      : new Date(getYear(transactionDate), transactionNextMonth, Number(finalDay) + 1)
  }

  public async execute({
    owner_id,
    description,
    date,
    amount,
    category_id,
    personal,
    split,
    payment_type_id,
    bank_id,
    store_id
  }: ICreateExpenseRequest): Promise<Expense> {
    if (!await this.checkIfParameterExists(category_id, Category)) throw new AppError(constants.errorMessages.notFoundCategory)
    if (!await this.checkIfParameterExists(payment_type_id, PaymentType)) throw new AppError(constants.errorMessages.notFoundPaymentType)
    if (bank_id && !await this.checkIfParameterExists(bank_id, Bank)) throw new AppError(constants.errorMessages.notFoundBank)
    if (store_id && !await this.checkIfParameterExists(store_id, Store)) throw new AppError(constants.errorMessages.notFoundStore)
    if (isFuture(date)) throw new AppError(constants.errorMessages.futureDate)

    const expensesRepository = getCustomRepository(ExpensesRepository)
    const isSameExpense = await expensesRepository.findByDescriptionAndDate(description, startOfDay(date))
    if (isSameExpense) throw new AppError(constants.errorMessages.existingExpense)

    const netAmount = this.calculateNetAmount(amount, personal, split)
    const dueDate = await this.calculateDueDate({
      transactionDate: date,
      paymentTypeId: payment_type_id,
      userId: owner_id,
      bankId: bank_id
    })

    const expense = expensesRepository.create({
      owner_id,
      description,
      date,
      amount: netAmount,
      category_id,
      personal: personal || false,
      split: personal ? false : (split || false),
      payment_type_id,
      bank_id,
      store_id,
      due_date: dueDate
    })
    await expensesRepository.save(expense)
    return expense
  }
}

export default CrateExpenseService
