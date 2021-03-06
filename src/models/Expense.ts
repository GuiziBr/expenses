import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Category from './Category'
import User from './User'
import PaymentType from './PaymentType'

@Entity('expenses')
class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  owner_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => PaymentType, { eager: true })
  @JoinColumn({ name: 'payment_type_id' })
  payment_type: PaymentType

  @Column()
  category_id: string

  @Column()
  payment_type_id: string

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
}

export default Expense
