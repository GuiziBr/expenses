import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Category from './Category'
import User from './User'

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

  @Column()
  category_id: string;

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
  shared: boolean
}

export default Expense
