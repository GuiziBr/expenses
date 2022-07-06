import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateStatementPeriods1657082888876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'statement_periods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'user_id',
            type: 'uuid'
          },
          {
            name: 'bank_id',
            type: 'uuid'
          },
          {
            name: 'initial_day',
            type: 'varchar'
          },
          {
            name: 'final_day',
            type: 'varchar'
          }
        ]
      })
    )
    const userIdFK = new TableForeignKey({
      name: 'UserId',
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    const bankIdFK = new TableForeignKey({
      name: 'BankId',
      columnNames: ['bank_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'banks',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    await queryRunner.createForeignKeys('statement_periods', [userIdFK, bankIdFK])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('statement_periods')
  }
}
