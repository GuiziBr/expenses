import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddCategoryIdField1613702854255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'category_id',
      type: 'uuid',
      isNullable: true
    }))
    await queryRunner.createForeignKey('expenses', new TableForeignKey({
      name: 'ExpenseCategory',
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('expenses', 'category_id')
  }
}
