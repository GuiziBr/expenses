import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'

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
}

export default Expense
