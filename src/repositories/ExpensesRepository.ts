import { Between, EntityRepository, LessThanOrEqual, Not, Repository } from 'typeorm'
import constants from '../constants'
import Expense from '../models/Expense'

enum Types {
  Income = 'income',
  Outcome = 'outcome'
}

enum Order {
  desc = 'DESC',
  asc = 'ASC'
}

enum OrderByColumn {
  description = 'description',
  amount = 'amount',
  date = 'date',
  due_date = 'due_date',
  category = 'category',
  payment_type = 'payment_type',
  bank = 'bank',
  store = 'store'
}

interface TypedExpense {
  id: string,
  owner_id: string,
  category: {
    id: string,
    description: string
  },
  description: string,
  amount: number,
  date: Date,
  due_date?: Date,
  type?: Types
  payment_type: {
    id: string
    description: string
  },
  bank?: {
    id: string
    name: string
  }
  store?: {
    id: string
    name: string
  }
}

interface Request {
  owner_id: string
  startDate: Date | null
  endDate?: Date,
  offset: number,
  limit: number
}

interface SharedExpensesResponse {
  expenses: Array<TypedExpense>,
  totalCount: number
}

interface PersonalExpensesResponse {
  expenses: Array<Omit<TypedExpense, 'type'>>,
  totalCount: number
}

interface BalanceResponse {
  personalBalance: number,
  sharedBalance: {
    paying: number,
    payed: number,
    total: number
  }
}

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {
  public async getSharedExpenses({ owner_id, startDate, endDate, offset, limit }: Request): Promise<SharedExpensesResponse> {
    const whereClause = {
      personal: false,
      ...startDate
        ? { date: Between(startDate, endDate) }
        : { date: LessThanOrEqual(endDate) }
    }
    const [expenses, totalCount] = await this.findAndCount({
      where: whereClause,
      order: { date: Order.desc }
    })
    const typedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => this.assembleExpense(expense, owner_id, true))

    return { expenses: typedExpenses, totalCount }
  }

  public async findByDescriptionAndDate(description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date }})
    return isSameExpense || null
  }

  public async getPersonalExpenses({ owner_id, startDate, endDate, offset, limit }: Request): Promise<PersonalExpensesResponse> {
    const searchDate = startDate ? Between(startDate, endDate) : LessThanOrEqual(endDate)
    const [expenses, totalCount] = await this.findAndCount({
      where: [
        { owner_id, date: searchDate, personal: true },
        { owner_id, date: searchDate, split: true },
        { owner_id: Not(owner_id), date: searchDate, personal: false }
      ],
      order: { date: Order.desc }
    })
    const formattedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => this.assembleExpense(expense, owner_id))
    return { expenses: formattedExpenses, totalCount }
  }

  public async getBalance({ owner_id, startDate, endDate }: IBalanceRequest): Promise<BalanceResponse> {
    const searchDate = startDate ? Between(startDate, endDate) : LessThanOrEqual(endDate)
    const [personalExpenses, sharedExpenses] = await Promise.all([
      this.find({
        where: [
          { owner_id, date: searchDate, personal: true },
          { owner_id, date: searchDate, split: true },
          { owner_id: Not(owner_id), date: searchDate, personal: false }
        ]
      }),
      this.find({ where: { personal: false, date: searchDate }})
    ])
    const personalBalance = personalExpenses.reduce((acc, expense) => acc + expense.amount, 0)
    const sharedBalance = sharedExpenses.reduce((acc, expense) => {
      if (expense.owner_id === owner_id) acc.paying += expense.amount
      else acc.payed += expense.amount
      return acc
    }, { paying: 0, payed: 0, total: 0 })
    return {
      personalBalance,
      sharedBalance: { total: sharedBalance.paying - sharedBalance.payed, paying: sharedBalance.paying, payed: sharedBalance.payed }
    }
  }
}

export default ExpensesRepository
