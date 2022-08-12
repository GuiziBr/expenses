import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, AfterInsert, AfterUpdate } from 'typeorm'

@Entity('banks')
class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({ type: Date, nullable: true })
  deleted_at?: Date | null

  @AfterInsert()
  logBankInsertion() {
    console.log(`Bank ID: ${this.id}, recorded at: ${this.created_at.toISOString()}`)
  }

  @AfterUpdate()
  logBankUpdate() {
    console.log(`Bank ID: ${this.id}, updated at: ${this.updated_at.toISOString()}`)
  }
}

export default Bank

export type PlainObjectBank = Omit<Bank, 'deleted_at'|'logBankInsertion'|'logBankUpdate'>
