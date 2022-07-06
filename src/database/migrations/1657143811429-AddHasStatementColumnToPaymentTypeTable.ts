import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddHasStatementColumnToPaymentTypeTable1657143811429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('payment_type', new TableColumn({
      name: 'hasStatement',
      type: 'boolean',
      isNullable: true
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('payment_type', 'hasStatement')
  }
}
