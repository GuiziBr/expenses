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
  startDate?: string
  endDate: string,
  offset: number,
  limit: number,
  orderBy?: string | OrderByColumn
  orderType?: 'asc' | 'desc'
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
  private assembleExpense(expense: TypedExpense, owner_id: string, isShared?: boolean): TypedExpense {
    return {
      id: expense.id,
      owner_id: expense.owner_id,
      description: expense.description,
      category: {
        id: expense.category.id,
        description: expense.category.description
      },
      amount: expense.amount,
      date: expense.date,
      due_date: expense.due_date,
      ...isShared && { type: expense.owner_id === owner_id ? Types.Income : Types.Outcome },
      ...expense.payment_type && {
        payment_type: {
          id: expense.payment_type.id,
          description: expense.payment_type.description
        }
      },
      ...expense.bank && {
        bank: {
          id: expense.bank.id,
          name: expense.bank.name
        }
      },
      ...expense.store && {
        store: {
          id: expense.store.id,
          name: expense.store.name
        }
      }
    }
  }

  private getSearchDateClause(endDate: string, startDate?: string): string {
    return startDate ? `expenses.date between '${startDate}' AND '${endDate}'` : `expenses.date <= ${endDate}`
  }

  private getOrderByClause(orderBy?: string): string {
    return orderBy
      ? constants.orderColumns[orderBy as keyof typeof constants.orderColumns]
      : constants.orderColumns.date
  }

  private getOrderTypeClause(orderType?: 'asc' | 'desc'): Order {
    return Order[orderType || 'asc']
  }

  public async getSharedExpenses({
    owner_id,
    startDate,
    endDate,
    offset,
    limit,
    orderBy,
    orderType
  }: Request): Promise<SharedExpensesResponse> {
    const [expenses, totalCount] = await this.createQueryBuilder('expenses')
      .innerJoinAndSelect('expenses.category', 'categories')
      .innerJoinAndSelect('expenses.payment_type', 'payment_type')
      .leftJoinAndSelect('expenses.bank', 'banks')
      .leftJoinAndSelect('expenses.store', 'stores')
      .where(`expenses.personal = false AND ${this.getSearchDateClause(endDate, startDate)}`)
      .orderBy(this.getOrderByClause(orderBy), this.getOrderTypeClause(orderType))
      .getManyAndCount()

    const typedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => this.assembleExpense(expense, owner_id, true))

    return { expenses: typedExpenses, totalCount }
  }

  public async findByDescriptionAndDate(description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date }})
    return isSameExpense || null
  }

  public async getPersonalExpenses({
    owner_id,
    startDate,
    endDate,
    offset,
    limit,
    orderBy,
    orderType
  }: Request): Promise<PersonalExpensesResponse> {
    const searchDateClause = this.getSearchDateClause(endDate, startDate)

    const [expenses, totalCount] = await this.createQueryBuilder('expenses')
      .innerJoinAndSelect('expenses.category', 'categories')
      .innerJoinAndSelect('expenses.payment_type', 'payment_type')
      .leftJoinAndSelect('expenses.bank', 'banks')
      .leftJoinAndSelect('expenses.store', 'stores')
      .where(`expenses.owner_id = :ownerId AND ${searchDateClause} AND expenses.personal = true`, { ownerId: owner_id })
      .orWhere(`expenses.owner_id = :ownerId AND ${searchDateClause} AND expenses.split = true`, { ownerId: owner_id })
      .orWhere(`expenses.owner_id <> :ownerId AND ${searchDateClause} AND expenses.personal = false`, { ownerId: owner_id })
      .orderBy(this.getOrderByClause(orderBy), this.getOrderTypeClause(orderType))
      .getManyAndCount()

    const formattedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => this.assembleExpense(expense, owner_id))
    return { expenses: formattedExpenses, totalCount }
  }

  public async getBalance({ owner_id, startDate, endDate }: Omit<Request, 'offset' | 'limit'>): Promise<BalanceResponse> {
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
