import { getRepository } from 'typeorm'
import constants from '../../constants'
import { IRequest } from '../../domains/category'
import AppError from '../../errors/AppError'
import Category from '../../models/Category'

class UpdateCategoryService {
  private async reactivate(categoryIdToDelete: string, categoryIdToRestore: string): Promise<Category | null> {
    const categoryRepository = getRepository(Category)
    await Promise.all([
      categoryRepository.softDelete(categoryIdToDelete),
      categoryRepository.restore(categoryIdToRestore)
    ])
    const category = await categoryRepository.findOne(categoryIdToRestore)
    return category || null
  }

  public async execute({ id, description }: IRequest): Promise<void> {
    const categoryRepository = getRepository(Category)

    const [category, sameDescriptionCategory] = await Promise.all([
      categoryRepository.findOne(id),
      categoryRepository.findOne({ where: { description }, withDeleted: true })
    ])

    if (!category) throw new AppError(constants.errorMessages.notFoundCategory, 404)

    if ((category && !sameDescriptionCategory) || (sameDescriptionCategory?.id === id)) {
      await categoryRepository.save({
        ...category,
        description,
        updated_at: new Date()
      })
    }

    if (!sameDescriptionCategory?.deleted_at) {
      throw new AppError(constants.errorMessages.duplicatedCategoryDescription, 400)
    }

    const reactivatedCategory = await this.reactivate(id, sameDescriptionCategory.id)

    if (!reactivatedCategory) throw new AppError(constants.errorMessages.internalError, 500)
  }
}

export default UpdateCategoryService
