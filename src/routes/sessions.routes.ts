import { Router } from 'express'

import AuthenticateUserService from '../services/AuthenticateUserService'
import { validateSession } from '../middlewares/validateInput'
import sessionAssembler from '../assemblers/sessionAssembler'

const sessionsRouter = Router()

sessionsRouter.post('/', validateSession, async (request, response) => {
  const { email, password } = request.body
  const authenticateUser = new AuthenticateUserService()
  const { user, token } = await authenticateUser.execute({ email, password })
  return response.json(sessionAssembler(user, token))
})

export default sessionsRouter
