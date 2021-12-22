import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('payment_type')
class PaymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  deleted_at: Date
}

export default PaymentType
