import { getRepository, IsNull } from 'typeorm'
import constants from '../../constants'
import Bank, { PlainObjectCategory } from '../../models/Category'

interface IListCategoryResponse {
  categories: PlainObjectCategory[],
  totalCount: number
}

class GetCategoryService {
  private parseCategory({ id, description, created_at, updated_at }: Bank): PlainObjectCategory {
    return { id, description, created_at, updated_at }
  }

  public async list(offset = constants.defaultOffset, limit = constants.defaultLimit): Promise<IListCategoryResponse> {
    const categoriesRepository = getRepository(Bank)
    const [categories, totalCount] = await categoriesRepository.findAndCount({ where: { deleted_at: IsNull() }})
    const paginatedCategories = categories.splice(Number(offset), Number(limit) || categories.length)
    return {
      categories: paginatedCategories.map(this.parseCategory),
      totalCount
    }
  }

  public async getById(id: string): Promise<PlainObjectCategory | null> {
    const categoriesRepository = getRepository(Bank)
    const category = await categoriesRepository.findOne({ where: { id, deleted_at: IsNull() }})
    return category ? this.parseCategory(category) : null
  }
}

export default GetCategoryService
