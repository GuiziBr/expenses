import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddDeletedAtIntoCategory1640142129368 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('categories', new TableColumn({
      name: 'deleted_at',
      type: 'timestamp',
      isNullable: true
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('categories', 'deleted_at')
  }
}
