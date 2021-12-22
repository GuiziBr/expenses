import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateCategory } from '../middlewares/validateInput'
import Category from '../models/Category'
import CreateCategoryService from '../services/CreateCategoryService'

const categoriesRouter = Router()

categoriesRouter.use(ensureAuthenticated)

categoriesRouter.get('/', async (_request, response) => {
  const categoriesRepository = getRepository(Category)
  const categories = await categoriesRepository.find({ where: { deleted_at: IsNull() }})
  return response.json(categories)
})

categoriesRouter.post('/', validateCategory, async (request, response) => {
  const { description } = request.body
  const createCategory = new CreateCategoryService()
  const category = await createCategory.execute({ description })
  return response.status(201).json(category)
})

export default categoriesRouter
