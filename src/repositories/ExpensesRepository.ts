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
    console.log('\nSTART_DATE--------', startDate)
    const endDate = endOfMonth(date)
    console.log('\nEND_DATE--------', endDate)
    const [expenses, totalCount] = await this.findAndCount({
      where: { personal: false, date: Between(startDate, endDate) },
      order: { date: Order.desc }
    })
    console.log('\nFIND_EXPENSES', JSON.stringify(expenses))
    const typedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => this.assembleExpense(expense, owner_id, true))
    console.log('\nTYPED_EXPENSES', JSON.stringify(typedExpenses))
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
}

export default ExpensesRepository
