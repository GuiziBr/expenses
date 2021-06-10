import { Router } from 'express'
import { assembleSession } from '../assemblers/sessionAssembler'
import { validateSession } from '../middlewares/validateInput'
import AuthenticateUserService from '../services/AuthenticateUserService'

const sessionsRouter = Router()

sessionsRouter.post('/', validateSession, async (request, response) => {
  const { email, password } = request.body
  const authenticateUser = new AuthenticateUserService()
  const { user, token } = await authenticateUser.execute({ email, password })
  return response.status(201).json(assembleSession(user, token))
})

export default sessionsRouter
