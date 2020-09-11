import Expense from '../models/Expense'

import { Repository, EntityRepository } from 'typeorm'

@EntityRepository(Expense)
class ExpensesRepository extends Repository<Expense> {
  public async getCurrentBalance (owner_id: string): Promise<number> {
    const expenses = await this.find()
    return expenses.reduce((balance, expense) => {
      if (expense.owner_id === owner_id) return balance + expense.amount
      return balance - expense.amount
    }, 0)
  }

  public async findByDescriptionAndDate (description: string, date: Date): Promise<Expense | null> {
    const isSameExpense = await this.findOne({ where: { description, date } })
    return isSameExpense || null
  }
}

export default ExpensesRepository
