import { Router } from 'express'
import constants from '../constants'
import AppError from '../errors/AppError'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import { validateDescription, validateId, validateListRoutes } from '../middlewares/validateInput'
import CreateCategoryService from '../services/category/CreateCategoryService'
import DeleteCategoryService from '../services/category/DeleteCategoryService'
import GetCategoryService from '../services/category/GetCategoryService'
import UpdateCategoryService from '../services/category/UpdateCategoryService'

const categoriesRouter = Router()

categoriesRouter.use(ensureAuthenticated)

categoriesRouter.get('/', validateListRoutes, async ({ query }, response) => {
  const { offset, limit } = query
  const getCategoryService = new GetCategoryService()
  const { categories, totalCount } = await getCategoryService.list(Number(offset), Number(limit))
  response.setHeader(constants.headerTypes.totalCount, totalCount)
  return response.json(categories)
})

categoriesRouter.get('/:id', validateId, async (request, response) => {
  const { id } = request.params
  const getCategoryService = new GetCategoryService()
  const category = await getCategoryService.getById(id)
  if (!category) throw new AppError(constants.errorMessages.notFoundCategory, 404)
  return response.json(category)
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
  const deleteCategoryService = new DeleteCategoryService()
  await deleteCategoryService.execute(id)
  return response.status(204).json()
})

export default categoriesRouter
