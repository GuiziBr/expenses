import Expense from '../models/Expense'
import { startOfMonth } from 'date-fns'

import { Repository, EntityRepository, MoreThanOrEqual } from 'typeorm'

enum Types {
  Income = 'income',
  Outcome = 'outcome'
}

interface TypedExpense {
  id: string,
  owner_id: string,
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
  date?: Date
}

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {
  public async getCurrentBalance ({ owner_id, date }: Request): Promise<Balance> {
    const filterDate = date || MoreThanOrEqual(startOfMonth(new Date()))
    const expenses = await this.find({ where: { date: filterDate } })

    const typedExpenses = expenses.map(expense => ({
      id: expense.id,
      owner_id: expense.owner_id,
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

    return {
      expenses: typedExpenses,
      paying,
      payed,
      total: paying - payed
    }
  }

  public async findByDescriptionAndDate (description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date } })
    return isSameExpense || null
  }
}

export default ExpensesRepository
