import { parseISO } from 'date-fns'
import { NextFunction, Request, Response } from 'express'

export function parseBodyDate(request: Request, _response: Response, next: NextFunction): void {
  const { date } = request.body
  request.body.date = parseISO(date)
  return next()
}
