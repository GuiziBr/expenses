import { isValid, parseISO } from 'date-fns'
import { NextFunction, Request, Response } from 'express'
import * as Yup from 'yup'
import AppError from '../errors/AppError'


export async function validateUser({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required')
    })
    await schema.validate(body, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateSession({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required')
    })
    await schema.validate(body, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateCategory({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({ description: Yup.string().required('Description is required') })
    await schema.validate(body, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateExpense({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      description: Yup.string().required('Description is required'),
      date: Yup.date().transform(parseDateString).typeError('Date is required and must be YYYY-MM-DD'),
      amount: Yup.number().required('Amount is required'),
      category_id: Yup.string().required('Category Id is required'),
      personal: Yup.boolean(),
      split: Yup.boolean()
    })
    await schema.validate(body, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateGetBalance({ query }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      date: Yup.date().transform(parseDateString).typeError('Date format must be YYYY-MM'),
      offset: Yup.number().min(0).default(1).typeError('Offset must be a number'),
      limit: Yup.number().min(1).max(20).default(20).typeError('Limit must be a number')
    })
    await schema.validate(query, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

function parseDateString(dateValue: Date, date: string) {
  return isValid(parseISO(date.toString())) && dateValue
}
