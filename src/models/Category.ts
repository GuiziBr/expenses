import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, AfterInsert, AfterUpdate } from 'typeorm'

@Entity('categories')
class Category {
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

  @AfterInsert()
  logCategoryInsertion() {
    console.log(`Category ID: ${this.id}, recorded at: ${this.created_at.toISOString()}`)
  }

  @AfterUpdate()
  logCategoryUpdate() {
    console.log(`Category ID: ${this.id}, updated at: ${this.updated_at.toISOString()}`)
  }
}

export default Category

export type TCategory = Omit<Category, 'deleted_at'|'logCategoryInsertion'|'logCategoryUpdate'>
