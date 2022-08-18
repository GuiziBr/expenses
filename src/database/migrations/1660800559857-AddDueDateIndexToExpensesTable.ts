import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class AddDueDateIndexToExpensesTable1660800559857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex('expenses', new TableIndex({
      name: 'IDX_EXPENSES_DUE_DATE',
      columnNames: ['due_date']
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('expenses', 'IDX_EXPENSES_DUE_DATE')
  }
}
