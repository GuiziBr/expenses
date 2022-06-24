import { Router } from 'express'
import { getRepository, IsNull } from 'typeorm'
import { categoryAssembleUser } from '../assemblers/categoryAssembler'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateDescription, validateId } from '../middlewares/validateInput'
import Category from '../models/Category'
import CreateCategoryService from '../services/category/CreateCategoryService'
import UpdateCategoryService from '../services/category/UpdateCategoryService'

const categoriesRouter = Router()

categoriesRouter.use(ensureAuthenticated)

categoriesRouter.get('/', async (_request, response) => {
  const categoriesRepository = getRepository(Category)
  const categories = await categoriesRepository.find({ where: { deleted_at: IsNull() }})
  return response.json(categories.map(categoryAssembleUser))
})

categoriesRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const categoriesRepository = getRepository(Category)
  const category = await categoriesRepository.findOne({ where: { id, deleted_at: IsNull() }})
  if (!category) throw new AppError(constants.errorMessages.notFoundCategory)
  return response.json(categoryAssembleUser(category))
})

categoriesRouter.patch('/:id', validateId, validateDescription, async (request, response) => {
  const { id } = request.params
  const { description } = request.body
  const updateCategory = new UpdateCategoryService()
  await updateCategory.execute(id, description)
  return response.status(204).json()
})

categoriesRouter.post('/', validateDescription, async (request, response) => {
  const { description } = request.body
  const createCategory = new CreateCategoryService()
  const category = await createCategory.execute(description)
  return response.status(201).json(category)
})

categoriesRouter.delete('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const categoriesRepository = getRepository(Category)
  const existingCategory = await categoriesRepository.findOne(id)
  if (!existingCategory || existingCategory.deleted_at) return response.status(204).json()
  await categoriesRepository.update(id, { deleted_at: new Date() })
  return response.status(204).json()
})

export default categoriesRouter
