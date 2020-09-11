import { Router } from 'express'

import CreateUserService from '../services/CreateUserService'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router()

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body
    const createUser = new CreateUserService()
    const user = await createUser.execute({ name, email, password })
    return response.json({ name: user.name, email: user.email })
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

usersRouter.patch('/avatar', ensureAuthenticated, async (request, response) => {
  return response.json({ ok: true })
})

export default usersRouter
