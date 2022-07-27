import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddPaymentTypeIdColumnToStatementPeriods1658446490389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('statement_periods', new TableColumn({
      name: 'payment_type_id',
      type: 'varchar'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('statement_periods', 'payment_type_id')
  }
}
