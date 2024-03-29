import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import cors from 'cors'
import { CronJob } from 'cron'
import { isLastDayOfMonth } from 'date-fns'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import { OpenApiValidator } from 'express-openapi-validator'
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'
import 'reflect-metadata'
import swaggerUi from 'swagger-ui-express'
import apiSchema from './api.schema.json'
import uploadConfig from './config/upload'
import constants from './constants'
import './database'
import AppError from './errors/AppError'
import routes from './routes'
import ReportService from './services/report/ReportService'

dotenv.config()
const app = express()

if (process.env.LOCAL === 'false') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}

if (process.env.LOCAL === 'false') {
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}

app.use(cors({
  origin: constants.corsOrigins,
  exposedHeaders: constants.headerTypes.totalCount
}))

app.use(express.json())
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)

if (process.env.LOCAL === 'false') {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        if (error.statusCode === 429 || error.statusCode === 500) {
          return true
        }
        return false
      }
    })
  )
}

app.use((err: Error, _request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) return response.status(err.statusCode).json({ status: 'error', message: err.message })
  console.error(err)
  return response.status(500).json({ status: 'error', message: constants.errorMessages.internalError })
})

async function docSetup(): Promise<void> {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(apiSchema))
  await new OpenApiValidator({
    apiSpec: apiSchema as OpenAPIV3.Document,
    validateRequests: true,
    validateResponses: true
  }).install(app)
}

const sendEmailJob = new CronJob(constants.cronJobTime, async () => {
  if (isLastDayOfMonth(new Date())) {
    const reportService = new ReportService()
    await reportService.execute()
    console.log(`CronJob executed at ${new Date()}`)
    return true
  }
  return false
}, null, false, constants.cronJobTimeZone)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
  sendEmailJob.start()
  docSetup()
})
