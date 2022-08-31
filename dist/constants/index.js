"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = {
    schemaValidationErrors: {
        nameRequired: 'name is required',
        emailRequired: 'email is required',
        passwordRequired: 'password is required',
        dateFormat: 'Date format must be YYYY-MM-DD',
        offsetType: 'Offset must be a number',
        limitType: 'Limit must be a number',
        descriptionRequired: 'description is required',
        dateRequired: 'date is required and must be YYYY-MM-DD',
        amountRequired: 'amount is required',
        categoryRequired: 'category_id is required',
        paymentTypeRequired: 'payment_type_id is required',
        monthRequired: 'month is required'
    },
    errorMessages: {
        incorrectLogin: 'Incorrect email/password combination',
        existingCategory: 'Category already exists',
        notFoundCategory: 'Category not found',
        futureDate: 'Date must not be in the future',
        existingExpense: 'This expense is already registered',
        emailInUse: 'Email address already in use',
        changeAvatarNotAllowed: 'Only authenticated users can change avatar',
        internalError: 'Internal server error',
        existingPaymentType: 'Payment type already exists',
        notFoundPaymentType: 'Payment type not found',
        duplicatedPaymentTypeDescription: 'There is already a payment type with same description',
        invalidRequestParam: 'Invalid request parameter',
        duplicatedCategoryDescription: 'There is already a category with same description',
        notFoundBank: 'Bank not found',
        existingBank: 'Bank already exists',
        duplicatedBankName: 'There is already a bank with same name',
        notFoundStore: 'Store not found',
        existingStore: 'Store already exists',
        duplicatedStoreName: 'There is already a store with same name',
        statementPeriodNotFound: 'No statement period for provided payment type and bank was found',
        paymentTypeStatementWithNoBank: 'This payment type must have a bank',
        statementPeriodToConsolidate: 'No statement period for consolidation was found'
    },
    headerTypes: { totalCount: 'X-Total-Count' },
    defaultLimit: 5,
    defaultOffset: 0,
    smtpService: 'gmail',
    reportSubject: 'Expenses Portal - Monthly Report',
    corsOrigins: [
        'https://expenses-portal.herokuapp.com',
        'http://localhost:3000',
        'https://expenses-portal.vercel.app',
        'https://expenses-portal.netlify.app'
    ],
    cronJobTime: '0 0 9 28-31 * *',
    cronJobTimeZone: 'America/Sao_Paulo',
    orderColumns: {
        description: 'expenses.description',
        amount: 'expenses.amount',
        date: 'expenses.date',
        due_date: 'expenses.due_date',
        category: 'categories.description',
        payment_type: 'payment_type.description',
        bank: 'banks.name',
        store: 'stores.name'
    },
    dateFormat: 'yyyy-MM-dd',
    filterColumns: {
        category: 'category_id',
        payment_type: 'payment_type_id',
        bank: 'bank_id',
        store: 'store_id'
    }
};
exports.default = constants;
