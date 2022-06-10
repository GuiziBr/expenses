import { getRepository } from 'typeorm'
import constants from '../constants'
import { ICategory } from '../domains/category'
import AppError from '../errors/AppError'
import Category from '../models/Category'

class CreateCategoryService {
  public async execute(description: string): Promise<Omit<ICategory, 'updated_at'>> {
    const categoryRepository = getRepository(Category)
    const categoryExists = await categoryRepository.findOne({ where: { description }})
    if (categoryExists) throw new AppError(constants.errorMessages.existingCategory)
    const category = categoryRepository.create({ description })
    await categoryRepository.save(category)
    return {
      id: category.id,
      description: category.description,
      created_at: category.created_at
    }
  }
}

export default CreateCategoryService
