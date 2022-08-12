import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, AfterInsert, AfterUpdate } from 'typeorm'

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

  @Column({ type: Date, nullable: true })
  deleted_at?: Date | null

  @Column()
  hasStatement: boolean

  @AfterInsert()
  logPaymentTypeInsertion() {
    console.log(`PaymentType ID: ${this.id}, recorded at: ${this.created_at.toISOString()}`)
  }

  @AfterUpdate()
  logPaymentTypeUpdate() {
    console.log(`PaymentType ID: ${this.id}, updated at: ${this.updated_at.toISOString()}`)
  }
}

export default PaymentType

export type PlainObjectPaymentType = Omit<PaymentType, 'deleted_at'|'logPaymentTypeInsertion'|'logPaymentTypeUpdate'>
