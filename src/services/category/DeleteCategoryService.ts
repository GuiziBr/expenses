import { getRepository } from 'typeorm'
import Category from '../../models/Category'

class DeleteCategoryService {
  public async execute(id: string): Promise<void> {
    const categoriesRepository = getRepository(Category)
    const existingCategory = await categoriesRepository.findOne(id)
    if (existingCategory && !existingCategory.deleted_at) {
      const categoryToDelete = categoriesRepository.create({ ...existingCategory, deleted_at: new Date() })
      await categoriesRepository.save(categoryToDelete)
    }
  }
}

export default DeleteCategoryService
