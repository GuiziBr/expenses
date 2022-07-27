import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm'
import User from './User'
import Bank from './Bank'
import PaymentType from './PaymentType'

@Entity('statement_periods')
class StatementPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  user_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  owner: User

  @Column()
  payment_type_id: string

  @OneToOne(() => PaymentType)
  @JoinColumn({ name: 'payment_type_id' })

  @Column()
  bank_id: string

  @OneToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })

  @Column()
  initial_day: string

  @Column()
  final_day: string
}

export default StatementPeriod
