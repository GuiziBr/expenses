import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Category, { PlainObjectCategory } from '../../models/Category'

class CreateCategoryService {
  private async reactivateCategory(categoryToRestore: Category): Promise<void> {
    const categoryRepository = getRepository(Category)
    await categoryRepository.save({ ...categoryToRestore, deleted_at: null })
  }

  private parseCategory({ id, description, created_at, updated_at }: Category): PlainObjectCategory {
    return { id, description, created_at, updated_at }
  }

  public async execute(description: string): Promise<PlainObjectCategory> {
    const categoryRepository = getRepository(Category)
    const existingCategory = await categoryRepository.findOne({ where: { description }, withDeleted: true })
    if (existingCategory) {
      if (!existingCategory.deleted_at) throw new AppError(constants.errorMessages.existingCategory)
      else await this.reactivateCategory(existingCategory)
      return this.parseCategory(existingCategory)
    }
    const category = categoryRepository.create({ description })
    await categoryRepository.save(category)
    return this.parseCategory(category)
  }
}

export default CreateCategoryService
