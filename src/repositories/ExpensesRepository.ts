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

interface Balance {
  expenses: Array<TypedExpense>,
  paying: number,
  payed: number,
  total: number
}

interface Request {
  owner_id: string
  date: Date,
  offset: number,
  limit: number
}

interface PersonalBalance {
  expenses: Array<Omit<TypedExpense, 'type'>>,
  balance: number
}

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {
  public async getCurrentBalance({ owner_id, date, offset, limit }: Request): Promise<Balance> {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)
    const expenses = await this.find({ where: { personal: false, date: Between(startDate, endDate)}, skip: offset, take: limit })
    const typedExpenses = expenses.map((expense) => ({
      id: expense.id,
      owner_id: expense.owner_id,
      category: { id: expense.category.id, description: expense.category.description },
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      type: expense.owner_id === owner_id ? Types.Income : Types.Outcome
    }))
    const { paying, payed } = typedExpenses.reduce((acc, typedExpense) => {
      if (typedExpense.owner_id === owner_id) acc.paying += typedExpense.amount
      else acc.payed += typedExpense.amount
      return acc
    }, { paying: 0, payed: 0, total: 0 })
    return { expenses: typedExpenses, paying, payed, total: paying - payed }
  }

  public async findByDescriptionAndDate(description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date }})
    return isSameExpense || null
  }

  public async getPersonalExpenses({ owner_id, date, offset, limit }: Request): Promise<PersonalBalance> {
    const searchDate = Between(startOfMonth(date), endOfMonth(date))
    const expenses = await this.find({
      where: [
        { owner_id, date: searchDate, personal: true },
        { owner_id, date: searchDate, split: true },
        { owner_id: Not(owner_id), date: searchDate, personal: false },
      ],
      skip: offset,
      take: limit
    })
    const formattedExpenses = expenses.map((expense) => ({
      id: expense.id,
      owner_id: expense.owner_id,
      category: { id: expense.category.id, description: expense.category.description },
      description: expense.description,
      amount: expense.amount,
      date: expense.date
    }))
    const balance = formattedExpenses.reduce((acc, typedExpense) => acc + typedExpense.amount, 0)
    return { expenses: formattedExpenses, balance }
  }
}

export default ExpensesRepository
