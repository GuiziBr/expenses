import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Category from '../../models/Category'

class UpdateCategoryService {
  private async reactivate(categoryIdToDelete: string, categoryIdToRestore: string): Promise<Category | null> {
    const categoriesRepository = getRepository(Category)
    await Promise.all([
      categoriesRepository.save({ id: categoryIdToDelete, deleted_at: new Date() }),
      categoriesRepository.save({ id: categoryIdToRestore, deleted_at: null })
    ])
    const category = await categoriesRepository.findOne(categoryIdToRestore)
    return category || null
  }

  public async execute(id: string, description: string): Promise<void> {
    const categoriesRepository = getRepository(Category)

    const [category, sameDescriptionCategory] = await Promise.all([
      categoriesRepository.findOne(id),
      categoriesRepository.findOne({ where: { description }, withDeleted: true })
    ])

    if (!category) throw new AppError(constants.errorMessages.notFoundCategory, 404)

    if ((category && !sameDescriptionCategory) || (sameDescriptionCategory?.id === id)) {
      await categoriesRepository.save({
        ...category,
        description,
        updated_at: new Date()
      })
      return
    }
    if (sameDescriptionCategory) {
      if (!sameDescriptionCategory?.deleted_at) {
        throw new AppError(constants.errorMessages.duplicatedCategoryDescription, 400)
      }
      const reactivatedCategory = await this.reactivate(id, sameDescriptionCategory.id)
      if (!reactivatedCategory) throw new AppError(constants.errorMessages.internalError, 500)
    }
  }
}

export default UpdateCategoryService
