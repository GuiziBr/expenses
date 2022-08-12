import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, AfterInsert, AfterUpdate } from 'typeorm'

@Entity('stores')
class Store {
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
  logStoreInsertion() {
    console.log(`Store ID: ${this.id}, recorded at: ${this.created_at.toISOString()}`)
  }

  @AfterUpdate()
  logStoreUpdate() {
    console.log(`Store ID: ${this.id}, updated at: ${this.updated_at.toISOString()}`)
  }
}

export default Store

export type TStore = Omit<Store, 'deleted_at'|'logStoreInsertion'|'logStoreUpdate'>
