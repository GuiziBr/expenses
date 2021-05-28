import cors from 'cors'
import { CronJob } from 'cron'
import { isLastDayOfMonth } from 'date-fns'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import uploadConfig from './config/upload'
import constants from './constants'
import './database'
import AppError from './errors/AppError'
import routes from './routes'
import ReportService from './services/ReportService'

dotenv.config()
const app = express()

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
})
