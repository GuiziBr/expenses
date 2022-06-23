import Category from '../models/Category'

type ICategory = Omit<Category, 'deleted_at'>

export function categoryAssembleUser({ id, description, created_at, updated_at }: Omit<Category, 'deleted_at'>): ICategory {
  return { id, description, created_at, updated_at }
}
