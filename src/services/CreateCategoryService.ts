import { getRepository } from 'typeorm'
import constants from '../constants'
import AppError from '../errors/AppError'
import Category from '../models/Category'

interface ICategory {
  id: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

interface IRequest {
  description: string
}

class CreateCategoryService {
  public async execute({ description }: IRequest): Promise<ICategory> {
    const categoryRepository = getRepository(Category)
    const categoryExists = await categoryRepository.findOne({ where: { description }})
    if (categoryExists) throw new AppError(constants.errorMessages.existingCategory)
    const category = categoryRepository.create({ description })
    await categoryRepository.save(category)
    return category
  }
}

export default CreateCategoryService
