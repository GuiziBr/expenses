import { Router } from 'express'
import balanceRouter from './balance.routes'
import categoriesRouter from './categories.routes'
import expensesRouter from './expenses.routes'
import paymentTypeRouter from './paymentTypes.routes'
import sessionsRouter from './sessions.routes'
import usersRouter from './users.routes'
import banksRouter from './banks.routes'

const routes = Router()

routes.use('/expenses', expensesRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/categories', categoriesRouter)
routes.use('/balance', balanceRouter)
routes.use('/paymentType', paymentTypeRouter)
routes.use('/banks', banksRouter)

export default routes
