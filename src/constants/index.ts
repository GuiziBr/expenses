const constants = {
  schemaValidationErrors: {
    nameRequired: 'name is required',
    emailRequired: 'email is required',
    passwordRequired: 'password is required',
    dateFormat: 'Date format must be YYYY-MM',
    offsetType: 'Offset must be a number',
    limitType: 'Limit must be a number',
    descriptionRequired: 'description is required',
    dateRequired: 'date is required and must be YYYY-MM-DD',
    amountRequired: 'amount is required',
    categoryRequired: 'category_id is required',
    paymentTypeRequired: 'payment_type_id is required'
  },
  errorMessages: {
    incorrectLogin: 'Incorrect email/password combination',
    existingCategory: 'Category already exists',
    notFoundCategory: 'Category not found',
    futureDate: 'Date must be in the future',
    existingExpense: 'This expense is already registered',
    emailInUse: 'Email address already in use',
    changeAvatarNotAllowed: 'Only authenticated users can change avatar',
    internalError: 'Internal server error',
    existingPaymentType: 'Payment type already exists',
    notFoundPaymentType: 'Payment type not found',
    duplicatedPaymentTypeDescription: 'There is already a payment type with same description',
    invalidRequestParam: 'Invalid request parameter',
    duplicatedCategoryDescription: 'There is already a category type with same description',
    notFoundBank: 'Bank not found',
    existingBank: 'Bank already exists'

  },
  headerTypes: { totalCount: 'X-Total-Count' },
  defaultLimit: 5,
  defaultOffset: 0,
  smtpService: 'gmail',
  reportSubject: 'Expenses Portal - Monthly Report',
  corsOrigins: ['https://expenses-portal.herokuapp.com', 'http://localhost:3000'],
  cronJobTime: '0 0 9 28-31 * *',
  cronJobTimeZone: 'America/Sao_Paulo'
}

export default constants
