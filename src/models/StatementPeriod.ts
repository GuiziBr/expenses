import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm'
import User from './User'
import Bank from './Bank'

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
  bank_id: string

  @OneToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })

  @Column()
  initial_day: string

  @Column()
  final_day: string
}

export default StatementPeriod
