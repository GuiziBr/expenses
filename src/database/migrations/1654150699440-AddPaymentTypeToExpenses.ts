import { TableColumn, TableForeignKey, MigrationInterface, QueryRunner } from 'typeorm'

export class AddPaymentTypeToExpenses1654150699440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'payment_type_id',
      type: 'uuid',
      isNullable: true
    }))
    await queryRunner.createForeignKey('expenses', new TableForeignKey({
      name: 'ExpensePaymentType',
      columnNames: ['payment_type_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'payment_type',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('expenses', 'payment_type_id')
  }
}
