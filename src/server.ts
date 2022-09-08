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
import rateLimiter from './middlewares/rateLimiter'
import routes from './routes'
import ReportService from './services/report/ReportService'

dotenv.config()
const app = express()

app.use(rateLimiter)

app.use(cors({
  origin: constants.corsOrigins,
  exposedHeaders: constants.headerTypes.totalCount
}))
app.use(express.json())
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)
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
