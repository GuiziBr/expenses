import { getRepository } from 'typeorm'
import constants from '../../constants'
import { ICategory } from '../../domains/category'
import AppError from '../../errors/AppError'
import Category from '../../models/Category'

class CreateCategoryService {
  private assemblePaymentTypeResponse(category: ICategory) {
    return {
      id: category.id,
      description: category.description,
      created_at: category.created_at
    }
  }

  public async execute(description: string): Promise<Omit<ICategory, 'updated_at'>> {
    const categoryRepository = getRepository(Category)
    const existingCategory = await categoryRepository.findOne({ where: { description }, withDeleted: true })
    if (existingCategory) {
      if (!existingCategory.deleted_at) throw new AppError(constants.errorMessages.existingCategory)
      else await categoryRepository.restore(existingCategory.id)
      return this.assemblePaymentTypeResponse(existingCategory)
    }
    const category = categoryRepository.create({ description })
    await categoryRepository.save(category)
    return this.assemblePaymentTypeResponse(category)
  }
}

export default CreateCategoryService
