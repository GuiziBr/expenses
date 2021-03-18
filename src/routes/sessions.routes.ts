import { Router } from 'express'
import sessionAssembler from '../assemblers/sessionAssembler'
import { validateSession } from '../middlewares/validateInput'
import AuthenticateUserService from '../services/AuthenticateUserService'

const sessionsRouter = Router()

sessionsRouter.post('/', validateSession, async (request, response) => {
  const { email, password } = request.body
  const authenticateUser = new AuthenticateUserService()
  const { user, token } = await authenticateUser.execute({ email, password })
  return response.json(sessionAssembler(user, token))
})

export default sessionsRouter
