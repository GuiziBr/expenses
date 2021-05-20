import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm'

export class CreatePaymentTypeTable1621473870874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_type',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'description',
            type: 'varchar'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      })
    )
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
    await queryRunner.dropTable('payment_type')
    await queryRunner.dropColumn('expenses', 'payment_type_id')
  }
}
