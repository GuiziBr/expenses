import { getRepository } from 'typeorm'
import { categoryAssembleUser } from '../../assemblers/categoryAssembler'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Category, { TCategory } from '../../models/Category'

class CreateCategoryService {
  private async reactivateCategory(categoryToRestore: Category): Promise<void> {
    const categoryRepository = getRepository(Category)
    await categoryRepository.save({ ...categoryToRestore, deleted_at: null })
  }

  public async execute(description: string): Promise<TCategory> {
    const categoryRepository = getRepository(Category)
    const existingCategory = await categoryRepository.findOne({ where: { description }, withDeleted: true })
    if (existingCategory) {
      if (!existingCategory.deleted_at) throw new AppError(constants.errorMessages.existingCategory)
      else await this.reactivateCategory(existingCategory)
      return categoryAssembleUser(existingCategory)
    }
    const category = categoryRepository.create({ description })
    await categoryRepository.save(category)
    return categoryAssembleUser(category)
  }
}

export default CreateCategoryService
