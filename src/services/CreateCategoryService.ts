import { getRepository } from 'typeorm'
import Category from '../models/Category'
import AppError from '../errors/AppError'

interface ICategory {
  id: string
  description: string
  created_at: Date
  updated_at: Date
}

interface IRequest {
  description: string
}

class CreateCategoryService {
  public async execute ({ description }: IRequest): Promise<ICategory> {
    const categoryRepository = getRepository(Category)
    const categoryExists = await categoryRepository.findOne({ where: { description } })
    if (categoryExists) throw new AppError('Category already exists')
    const category = categoryRepository.create({ description })
    await categoryRepository.save(category)
    return category
  }
}

export default CreateCategoryService
