import { getRepository } from 'typeorm'
import constants from '../../constants'
import AppError from '../../errors/AppError'
import Category from '../../models/Category'

class UpdateCategoryService {
  private async reactivate(categoryIdToDelete: string, categoryIdToRestore: string): Promise<Category | null> {
    const categoriesRepository = getRepository(Category)

    const categoryToDelete = categoriesRepository.create({ id: categoryIdToDelete, deleted_at: new Date() })
    const categoryToReactivate = categoriesRepository.create({ id: categoryIdToRestore, deleted_at: null })

    await Promise.all([
      categoriesRepository.save(categoryToDelete),
      categoriesRepository.save(categoryToReactivate)
    ])

    return categoryToReactivate
  }

  public async execute(id: string, description: string): Promise<void> {
    const categoriesRepository = getRepository(Category)

    const [category, sameDescriptionCategory] = await Promise.all([
      categoriesRepository.findOne(id),
      categoriesRepository.findOne({ where: { description }, withDeleted: true })
    ])

    if (!category) throw new AppError(constants.errorMessages.notFoundCategory, 404)

    if ((category && !sameDescriptionCategory) || (sameDescriptionCategory?.id === id)) {
      const categoryToUpdate = categoriesRepository.create({ ...category, description, updated_at: new Date() })
      await categoriesRepository.save(categoryToUpdate)
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
