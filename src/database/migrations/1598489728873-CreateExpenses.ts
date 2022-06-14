import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export default class CreateExpenses1598489728873 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'expenses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'owner',
            type: 'varchar'
          },
          {
            name: 'description',
            type: 'varchar'
          },
          {
            name: 'date',
            type: 'date'
          },
          {
            name: 'amount',
            type: 'integer'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('expenses')
  }
}
