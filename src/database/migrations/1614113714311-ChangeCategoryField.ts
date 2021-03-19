import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeColumnCategoryId1613703681897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE public.expenses ALTER COLUMN category_id SET NOT NULL;')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE public.expenses ALTER COLUMN category_id DROP NOT NULL;')
  }
}
