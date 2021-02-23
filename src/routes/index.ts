import { Router } from 'express'
import expensesRouter from './expenses.routes'
import usersRouter from './users.routes'
import sessionsRouter from './sessions.routes'
import categoriesRouter from './categories.routes'

const routes = Router()

routes.use('/expenses', expensesRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/categories', categoriesRouter)

export default routes
