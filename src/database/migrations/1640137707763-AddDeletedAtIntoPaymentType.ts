import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddDeletedAtIntoPaymentType1640137707763 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('payment_type', new TableColumn({
      name: 'deleted_at',
      type: 'timestamp',
      isNullable: true
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('payment_type', 'deleted_at')
  }
}
