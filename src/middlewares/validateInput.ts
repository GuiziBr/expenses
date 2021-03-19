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
      date: Yup.date().required('Date is required'),
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
