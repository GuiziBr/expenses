import { MigrationInterface, QueryRunner } from 'typeorm'
import { addMonths, format } from 'date-fns'
import Expense from '../../models/Expense'
import constants from '../../constants'

export class UpdateDueDateNoStatementExpenses1660878747033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const expenses: Expense[] = await queryRunner.query(
      'select e.id, e."date", e.due_date from expenses e inner join payment_type pt on e.payment_type_id = pt.id where pt."hasStatement" is null'
    )
    await Promise.all(expenses.map((expense) => {
      const newDueDate = format(addMonths(expense.date, 1), constants.dateFormat)
      return queryRunner.query(`update expenses set due_date = '${newDueDate}' where id = '${expense.id}'`)
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const expenses: Expense[] = await queryRunner.query(
      'select e.id, e."date", e.due_date from expenses e inner join payment_type pt on e.payment_type_id = pt.id where pt."hasStatement" is null'
    )
    await Promise.all(expenses.map((expense) => {
      const oldDueDate = format(expense.date, constants.dateFormat)
      return queryRunner.query(`update expenses set due_date = '${oldDueDate}' where id = '${expense.id}'`)
    }))
  }
}
