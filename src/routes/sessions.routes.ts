import { Router } from 'express'

import AuthenticateUserService from '../services/AuthenticateUserService'
import sessionAssembler from '../assemblers/sessionAssembler'

const sessionsRouter = Router()

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body
    const authenticateUser = new AuthenticateUserService()
    const { user, token } = await authenticateUser.execute({ email, password })
    return response.json(sessionAssembler(user, token))
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

export default sessionsRouter
