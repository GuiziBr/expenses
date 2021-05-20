import { Router } from 'express'
import categoriesRouter from './categories.routes'
import expensesRouter from './expenses.routes'
import sessionsRouter from './sessions.routes'
import usersRouter from './users.routes'
import balanceRouter from './balance.routes'
import paymentTypeRouter from './paymentType.routes'

const routes = Router()

routes.use('/expenses', expensesRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/categories', categoriesRouter)
routes.use('/balance', balanceRouter)
routes.use('/paymentType', paymentTypeRouter)

export default routes
