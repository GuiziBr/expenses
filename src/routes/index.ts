import { Router } from 'express'
import categoriesRouter from './categories.routes'
import expensesRouter from './expenses.routes'
import sessionsRouter from './sessions.routes'
import usersRouter from './users.routes'

const routes = Router()

routes.use('/expenses', expensesRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/categories', categoriesRouter)

export default routes
