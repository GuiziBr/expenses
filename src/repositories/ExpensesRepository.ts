import { endOfMonth, startOfMonth } from 'date-fns'
import { Between, EntityRepository, Repository, Not } from 'typeorm'
import Expense from '../models/Expense'

enum Types {
  Income = 'income',
  Outcome = 'outcome'
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
  type: Types
}

interface CurrentBalanceResponse {
  currentBalance: {
    expenses: Array<TypedExpense>,
    paying: number,
    payed: number,
    total: number
  }
  totalCount: number
}

interface Request {
  owner_id: string
  date: Date,
  offset: number,
  limit: number
}

interface PersonalBalanceResponse {
  personalBalance: {
    expenses: Array<Omit<TypedExpense, 'type'>>,
    balance: number,
  },
  totalCount: number
}

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {
  public async getCurrentBalance({ owner_id, date, offset, limit }: Request): Promise<CurrentBalanceResponse> {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)

    const [expenses, totalCount] = await this.findAndCount({ where: { personal: false, date: Between(startDate, endDate) }})

    const { paying, payed } = expenses.reduce((acc, expense) => {
      if (expense.owner_id === owner_id) acc.paying += expense.amount
      else acc.payed += expense.amount
      return acc
    }, { paying: 0, payed: 0, total: 0 })

    const typedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => ({
        id: expense.id,
        owner_id: expense.owner_id,
        category: { id: expense.category.id, description: expense.category.description },
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        type: expense.owner_id === owner_id ? Types.Income : Types.Outcome
      }))

    return { currentBalance: { expenses: typedExpenses, paying, payed, total: paying - payed }, totalCount }
  }

  public async findByDescriptionAndDate(description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date }})
    return isSameExpense || null
  }

  public async getPersonalExpenses({ owner_id, date, offset, limit }: Request): Promise<PersonalBalanceResponse> {
    const searchDate = Between(startOfMonth(date), endOfMonth(date))
    const [expenses, totalCount] = await this.findAndCount({
      where: [
        { owner_id, date: searchDate, personal: true },
        { owner_id, date: searchDate, split: true },
        { owner_id: Not(owner_id), date: searchDate, personal: false }
      ]
    })
    const balance = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    const formattedExpenses = expenses
      .splice(offset, limit)
      .map((expense) => ({
        id: expense.id,
        owner_id: expense.owner_id,
        category: { id: expense.category.id, description: expense.category.description },
        description: expense.description,
        amount: expense.amount,
        date: expense.date
      }))
    return { personalBalance: { expenses: formattedExpenses, balance }, totalCount }
  }
}

export default ExpensesRepository
