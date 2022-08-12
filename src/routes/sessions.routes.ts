import { Router } from 'express'
import { validateSession } from '../middlewares/validateInput'
import AuthenticateUserService from '../services/user/AuthenticateUserService'

const sessionsRouter = Router()

sessionsRouter.post('/', validateSession, async (request, response) => {
  const { email, password } = request.body
  const authenticateUser = new AuthenticateUserService()
  const session = await authenticateUser.execute({ email, password })
  return response.status(201).json(session)
})

export default sessionsRouter
