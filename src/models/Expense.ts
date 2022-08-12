import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, AfterInsert } from 'typeorm'
import Category from './Category'
import PaymentType from './PaymentType'
import User from './User'
import Bank from './Bank'
import Store from './Store'

@Entity('expenses')
class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => PaymentType, { eager: true })
  @JoinColumn({ name: 'payment_type_id' })
  payment_type: PaymentType

  @ManyToOne(() => Bank, { eager: true })
  @JoinColumn({ name: 'bank_id' })
  bank: Bank

  @ManyToOne(() => Store, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store

  @Column()
  owner_id: string

  @Column()
  category_id: string

  @Column()
  payment_type_id: string

  @Column()
  bank_id: string

  @Column()
  store_id: string

  @Column()
  description: string

  @Column('date')
  date: Date

  @Column('integer')
  amount: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  split: boolean

  @Column()
  personal: boolean

  @Column('date')
  due_date: Date

  @AfterInsert()
  logExpenseInsertions() {
    console.log(`Expense ID: ${this.id}, recorded at: ${this.created_at.toISOString()}, by User ID: ${this.owner_id}`)
  }
}

export default Expense
