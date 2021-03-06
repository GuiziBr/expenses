"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = {
    schemaValidationErrors: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        dateFormat: 'Date format must be YYYY-MM',
        offsetType: 'Offset must be a number',
        limitType: 'Limit must be a number',
        descriptionRequired: 'Description is required',
        dateRequired: 'Date is required and must be YYYY-MM-DD',
        amountRequired: 'Amount is required',
        categoryRequired: 'Category is required',
        paymentTypeRequired: 'Payment type is required'
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
        notFoundPaymentType: 'Payment type not found'
    },
    headerTypes: { totalCount: 'X-Total-Count' },
    defaultLimit: 5,
    defaultOffset: 0,
    smtpService: 'gmail',
    reportSubject: 'Expenses Portal - Monthly Report',
    corsOrigins: ['https://expenses-portal.herokuapp.com', 'http://localhost:3000'],
    cronJobTime: '0 0 9 28-31 * *',
    cronJobTimeZone: 'America/Sao_Paulo'
};
exports.default = constants;
