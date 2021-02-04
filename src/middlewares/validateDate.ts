import { Request, Response, NextFunction } from 'express'
import { parseISO, isValid } from 'date-fns'

import AppError from '../errors/AppError'

export function parseBodyDate (request: Request, _response: Response, next: NextFunction): void {
  const { date } = request.body
  const parsedDate = parseISO(date)
  if (!isValid(parsedDate)) throw new AppError('Date format must be YYYY-MM-DD')
  request.body.date = parsedDate
  return next()
}

export function validateQueryDate (request: Request, _response: Response, next: NextFunction): void {
  const { date } = request.query
  if (date && !isValid(parseISO(date.toString()))) throw new AppError('Date format must be YYYY-MM')
  return next()
}
