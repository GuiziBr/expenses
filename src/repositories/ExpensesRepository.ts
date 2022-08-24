import { EntityRepository, Repository } from 'typeorm'
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

enum FilterByColumn {
  category = 'category',
  payment_type = 'paymentType',
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

interface IRequest {
  owner_id: string
  startDate?: string
  endDate: string
  offset?: number
  limit?: number
  orderBy?: string | OrderByColumn
  orderType?: 'asc' | 'desc',
  filterBy?: string | FilterByColumn
  filterValue?: string
}

interface IBalanceRequest {
  owner_id: string
  startDate?: string
  endDate: string
  filterBy?: string | FilterByColumn
  filterValue?: string
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
    return startDate ? `expenses.due_date between '${startDate}' AND '${endDate}'` : `expenses.due_date <= '${endDate}'`
  }

  private getOrderByClause(orderBy?: string): string {
    return orderBy
      ? constants.orderColumns[orderBy as keyof typeof constants.orderColumns]
      : constants.orderColumns.date
  }

  private getOrderTypeClause(orderType?: 'asc' | 'desc'): Order {
    return Order[orderType || 'asc']
  }

  private getFilterClause(filterBy?: string): string | null {
    if (!filterBy) return null
    const filterByColumn = constants.filterColumns[filterBy as keyof typeof constants.filterColumns]
    return `expenses.${filterByColumn} = :filterValue`
  }

  public async getSharedExpenses({
    owner_id,
    startDate,
    endDate,
    offset = constants.defaultOffset,
    limit,
    orderBy,
    orderType,
    filterBy,
    filterValue
  }: IRequest): Promise<SharedExpensesResponse> {
    const filterClause = this.getFilterClause(filterBy)

    const query = this.createQueryBuilder('expenses')
      .innerJoinAndSelect('expenses.category', 'categories')
      .innerJoinAndSelect('expenses.payment_type', 'payment_type')
      .leftJoinAndSelect('expenses.bank', 'banks')
      .leftJoinAndSelect('expenses.store', 'stores')
      .where(`expenses.personal = false AND ${this.getSearchDateClause(endDate, startDate)}`)
      .orderBy(this.getOrderByClause(orderBy), this.getOrderTypeClause(orderType))

    if (filterClause) query.andWhere(filterClause, { filterValue })

    const [expenses, totalCount] = await query.getManyAndCount()

    const typedExpenses = expenses
      .splice(offset, limit || expenses.length)
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
    offset = 0,
    limit,
    orderBy,
    orderType,
    filterBy,
    filterValue
  }: IRequest): Promise<PersonalExpensesResponse> {
    const searchDateClause = this.getSearchDateClause(endDate, startDate)
    const filterClause = this.getFilterClause(filterBy)

    console.log('SEARCH', searchDateClause)

    const query = this.createQueryBuilder('expenses')
      .innerJoinAndSelect('expenses.category', 'categories')
      .innerJoinAndSelect('expenses.payment_type', 'payment_type')
      .leftJoinAndSelect('expenses.bank', 'banks')
      .leftJoinAndSelect('expenses.store', 'stores')

    if (filterClause) query.where(filterClause, { filterValue })

    query
      .andWhere(searchDateClause)
      .andWhere(
        '((expenses.owner_id = :ownerId AND (expenses.personal = true OR expenses.split = true))'
        + 'OR (expenses.owner_id <> :ownerId AND expenses.personal = false))',
        { ownerId: owner_id }
      )
      .orderBy(this.getOrderByClause(orderBy), this.getOrderTypeClause(orderType))

    const [expenses, totalCount] = await query.getManyAndCount()

    const formattedExpenses = expenses
      .splice(offset, limit || expenses.length)
      .map((expense) => this.assembleExpense(expense, owner_id))

    return { expenses: formattedExpenses, totalCount }
  }

  public async getBalance(data: IBalanceRequest): Promise<BalanceResponse> {
    const [{ expenses: personalExpenses }, { expenses: sharedExpenses }] = await Promise.all([
      this.getPersonalExpenses(data),
      this.getSharedExpenses(data)
    ])

    const { owner_id } = data

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
