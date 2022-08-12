import Category, { TCategory } from '../models/Category'

export function categoryAssembleUser({ id, description, created_at, updated_at }: Omit<Category, 'deleted_at'>): TCategory {
  return { id, description, created_at, updated_at }
}
