import { Router } from 'express'
import { getRepository } from 'typeorm'
import Category from '../models/Category'
import CreateCategoryService from '../services/CreateCategoryService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const categoriesRouter = Router()

categoriesRouter.use(ensureAuthenticated)

categoriesRouter.get('/', async (_request, response) => {
  const categoriesRepository = getRepository(Category)
  const categories = await categoriesRepository.find()
  return response.json(categories)
})

categoriesRouter.post('/', async (request, response) => {
  const { description } = request.body
  const createCategory = new CreateCategoryService()
  const category = await createCategory.execute({ description })
  return response.json(category)
})

export default categoriesRouter
