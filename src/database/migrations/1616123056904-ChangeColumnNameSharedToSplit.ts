import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ChangeColumnNameSharedToSplit1616123056904 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE public.expenses RENAME COLUMN shared TO split;')
    await queryRunner.addColumn('expenses', new TableColumn({
      name: 'personal',
      type: 'boolean',
      isNullable: true
    }))
    await queryRunner.query('UPDATE public.expenses SET personal = false')
    await queryRunner.query('ALTER TABLE public.expenses ALTER COLUMN personal SET NOT NULL')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE public.expenses RENAME COLUMN split to shared;')
    await queryRunner.dropColumn('expenses', 'personal')
  }
}
