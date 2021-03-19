import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export default class AlterOwnerFieldToOwnerId1598575338800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('expenses', 'owner')
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'owner_id',
      type: 'uuid'
    }))
    await queryRunner.createForeignKey('expenses', new TableForeignKey({
      name: 'ExpenseOwner',
      columnNames: ['owner_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('expenses', 'ExpenseOwner')
    await queryRunner.dropColumn('expenses', 'owner_id')
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'owner',
      type: 'varchar'
    }))
  }
}
