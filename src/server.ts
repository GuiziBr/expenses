import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import 'reflect-metadata'
import uploadConfig from './config/upload'
import './database'
import AppError from './errors/AppError'
import routes from './routes/'

dotenv.config()
const app = express()

app.use(cors({ origin: ['https://expenses-portal.herokuapp.com', 'http://localhost:3000'] }))
app.use(express.json())
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)
app.use((err: Error, _request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) return response.status(err.statusCode).json({ status: 'error', message: err.message })
  console.error(err)
  return response.status(500).json({ status: 'error', message: 'Internal server error' })
})

const port = process.env.PORT

app.listen(process.env.PORT, () => console.log(`Server started on port ${port}`))
