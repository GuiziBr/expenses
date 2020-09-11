import { Router } from 'express'
import expensesRouter from './expenses.routes'
import usersRouter from './users.routes'
import sessionsRouter from './sessions.routes'

const routes = Router()

routes.use('/expenses', expensesRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

export default routes
