import { MigrationInterface, QueryRunner } from 'typeorm'
import { format } from 'date-fns'
import Expense from '../../models/Expense'
import constants from '../../constants'

export class UpdateAllExpensesWithNoDueDate1660801416942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const expenses: Expense[] = await queryRunner.query('select * from expenses e where e.due_date is null')
    await Promise.all(
      expenses.map((expense) => queryRunner.query(
        `update expenses set due_date = '${format(expense.date, constants.dateFormat)}' where id = '${expense.id}'`
      ))
    )
  }

  down(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
