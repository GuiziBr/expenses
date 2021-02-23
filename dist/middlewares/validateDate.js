"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryDate = exports.parseBodyDate = void 0;
var date_fns_1 = require("date-fns");
var AppError_1 = __importDefault(require("../errors/AppError"));
function parseBodyDate(request, _response, next) {
    var date = request.body.date;
    var parsedDate = date_fns_1.parseISO(date);
    if (!date_fns_1.isValid(parsedDate))
        throw new AppError_1.default('Date format must be YYYY-MM-DD');
    request.body.date = parsedDate;
    return next();
}
exports.parseBodyDate = parseBodyDate;
function validateQueryDate(request, _response, next) {
    var date = request.query.date;
    if (date && !date_fns_1.isValid(date_fns_1.parseISO(date.toString())))
        throw new AppError_1.default('Date format must be YYYY-MM');
    return next();
}
exports.validateQueryDate = validateQueryDate;
