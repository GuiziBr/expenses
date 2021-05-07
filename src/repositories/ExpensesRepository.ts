import { endOfMonth, startOfMonth } from 'date-fns'
import { Between, EntityRepository, Not, Repository } from 'typeorm'
import Expense from '../models/Expense'

enum Types {
  Income = 'income',
  Outcome = 'outcome'
}

enum Order {
  desc = 'DESC',
  asc = 'ASC'
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
  type?: Types
}

interface Request {
  owner_id: string
  date: Date,
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
  public async getSharedExpenses({ owner_id, date, offset, limit }: Request): Promise<SharedExpensesResponse> {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)
    const [expenses, totalCount] = await this.findAndCount({
      where: { personal: false, date: Between(startDate, endDate) },
      order: { date: Order.desc }
    })
    const typedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => this.assembleExpense(expense, owner_id))
    return { expenses: typedExpenses, totalCount }
  }

  public async findByDescriptionAndDate(description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date }})
    return isSameExpense || null
  }

  public async getPersonalExpenses({ owner_id, date, offset, limit }: Request): Promise<PersonalExpensesResponse> {
    const searchDate = Between(startOfMonth(date), endOfMonth(date))
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

  public async getBalance({ owner_id, date }: Omit<Request, 'offset' | 'limit'>): Promise<BalanceResponse> {
    const searchDate = Between(startOfMonth(date), endOfMonth(date))
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

  private assembleExpense(expense: TypedExpense, owner_id: string): TypedExpense {
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
      ...expense.type && { type: expense.owner_id === owner_id ? Types.Income : Types.Outcome }
    }
  }
}

export default ExpensesRepository
