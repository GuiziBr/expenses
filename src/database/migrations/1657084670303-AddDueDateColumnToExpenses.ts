import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddDueDateColumnToExpenses1657084670303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'due_date',
      type: 'date',
      isNullable: true
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('expenses', 'due_date')
  }
}
