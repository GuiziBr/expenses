"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var typeorm_1 = require("typeorm");
var constants_1 = __importDefault(require("../constants"));
var AppError_1 = __importDefault(require("../errors/AppError"));
var Category_1 = __importDefault(require("../models/Category"));
var PaymentType_1 = __importDefault(require("../models/PaymentType"));
var ExpensesRepository_1 = __importDefault(require("../repositories/ExpensesRepository"));
var CrateExpenseService = /** @class */ (function () {
    function CrateExpenseService() {
    }
    CrateExpenseService.prototype.checkIfParameterExists = function (id, model) {
        return __awaiter(this, void 0, void 0, function () {
            var repository, parameter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        repository = typeorm_1.getRepository(model);
                        return [4 /*yield*/, repository.findOne({ id: id })];
                    case 1:
                        parameter = _a.sent();
                        return [2 /*return*/, !!parameter];
                }
            });
        });
    };
    CrateExpenseService.prototype.calculateNetAmount = function (amount, personal, split) {
        return personal ? amount : (split ? Math.round(amount / 2) : amount);
    };
    CrateExpenseService.prototype.execute = function (_a) {
        var owner_id = _a.owner_id, description = _a.description, date = _a.date, amount = _a.amount, category_id = _a.category_id, personal = _a.personal, split = _a.split, payment_type_id = _a.payment_type_id;
        return __awaiter(this, void 0, void 0, function () {
            var expensesRepository, isSameExpense, netAmount, expense;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.checkIfParameterExists(category_id, Category_1.default)];
                    case 1:
                        if (!(_b.sent()))
                            throw new AppError_1.default(constants_1.default.errorMessages.notFoundCategory);
                        return [4 /*yield*/, this.checkIfParameterExists(payment_type_id, PaymentType_1.default)];
                    case 2:
                        if (!(_b.sent()))
                            throw new AppError_1.default(constants_1.default.errorMessages.notFoundPaymentType);
                        if (date_fns_1.isFuture(date))
                            throw new AppError_1.default(constants_1.default.errorMessages.futureDate);
                        expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
                        return [4 /*yield*/, expensesRepository.findByDescriptionAndDate(description, date_fns_1.startOfDay(date))];
                    case 3:
                        isSameExpense = _b.sent();
                        if (isSameExpense)
                            throw new AppError_1.default(constants_1.default.errorMessages.existingExpense);
                        netAmount = this.calculateNetAmount(amount, personal, split);
                        expense = expensesRepository.create({
                            owner_id: owner_id,
                            description: description,
                            date: date,
                            amount: netAmount,
                            category_id: category_id,
                            personal: personal || false,
                            split: personal ? false : (split || false),
                            payment_type_id: payment_type_id
                        });
                        return [4 /*yield*/, expensesRepository.save(expense)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, expense];
                }
            });
        });
    };
    return CrateExpenseService;
}());
exports.default = CrateExpenseService;
