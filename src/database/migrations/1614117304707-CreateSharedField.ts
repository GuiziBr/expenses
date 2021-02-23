import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class CreateSharedField1614117304707 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'shared',
      type: 'boolean',
      isNullable: true
    }))
    await queryRunner.query('UPDATE public.expenses SET shared = false')
    await queryRunner.query('ALTER TABLE public.expenses ALTER COLUMN shared SET NOT NULL')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('expenses', 'shared')
  }
}
