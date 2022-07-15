import { isValid, parseISO } from 'date-fns'
import { NextFunction, Request, Response } from 'express'
import * as Yup from 'yup'
import { validate } from 'uuid'
import constants from '../constants'
import AppError from '../errors/AppError'

function parseDateString(dateValue: Date, date: string) {
  return isValid(parseISO(date.toString())) && dateValue
}

export async function validateUser({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().min(1).required(constants.schemaValidationErrors.nameRequired),
      email: Yup.string().min(1).required(constants.schemaValidationErrors.emailRequired),
      password: Yup.string().min(1).required(constants.schemaValidationErrors.passwordRequired)
    })
    await schema.validate(body, { abortEarly: true })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateSession({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      email: Yup.string().min(1).required(constants.schemaValidationErrors.emailRequired),
      password: Yup.string().min(1).required(constants.schemaValidationErrors.passwordRequired)
    })
    await schema.validate(body, { abortEarly: true })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateDescription({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({ description: Yup.string().min(1).required(constants.schemaValidationErrors.descriptionRequired) })
    await schema.validate(body, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validatePaymentType({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      description: Yup.string().min(1).required(constants.schemaValidationErrors.descriptionRequired),
      hasStatement: Yup.boolean()
    })
    await schema.validate(body, { abortEarly: true })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateCreateExpense({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      description: Yup.string().min(1).required(constants.schemaValidationErrors.descriptionRequired),
      date: Yup.date().transform(parseDateString).typeError(constants.schemaValidationErrors.dateRequired),
      amount: Yup.number().required(constants.schemaValidationErrors.amountRequired),
      category_id: Yup.string().min(1).required(constants.schemaValidationErrors.categoryRequired),
      personal: Yup.boolean(),
      split: Yup.boolean(),
      payment_type_id: Yup.string().min(1).required(constants.schemaValidationErrors.paymentTypeRequired),
      bank_id: Yup.string().min(1),
      store_id: Yup.string().min(1)
    })
    await schema.validate(body, { abortEarly: true })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateGetExpenses({ query }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      startDate: Yup.date().transform(parseDateString).typeError(constants.schemaValidationErrors.dateFormat),
      endDate: Yup.date().transform(parseDateString).typeError(constants.schemaValidationErrors.dateFormat),
      offset: Yup.number().min(0).default(1).typeError(constants.schemaValidationErrors.offsetType),
      limit: Yup.number().min(1).max(20).default(20)
        .typeError(constants.schemaValidationErrors.limitType)
    })
    await schema.validate(query, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateGetBalance({ query }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({
      startDate: Yup.date().transform(parseDateString).typeError(constants.schemaValidationErrors.dateFormat),
      endDate: Yup.date().transform(parseDateString).typeError(constants.schemaValidationErrors.dateFormat)
    })
    await schema.validate(query, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}

export async function validateId({ params }: Request, _response: Response, next: NextFunction): Promise<void> {
  const { id } = params
  if (!validate(id)) throw new AppError(constants.errorMessages.invalidRequestParam)
  return next()
}

export async function validateName({ body }: Request, _response: Response, next: NextFunction): Promise<void> {
  try {
    const schema = Yup.object().shape({ name: Yup.string().min(1).required(constants.schemaValidationErrors.nameRequired) })
    await schema.validate(body, { abortEarly: false })
  } catch (err) {
    if (err instanceof Yup.ValidationError) throw new AppError(err.message)
  }
  return next()
}
