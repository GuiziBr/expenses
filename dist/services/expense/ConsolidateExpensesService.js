"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var constants_1 = __importDefault(require("../../constants"));
var AppError_1 = __importDefault(require("../../errors/AppError"));
var StatementPeriod_1 = __importDefault(require("../../models/StatementPeriod"));
var ExpensesRepository_1 = __importDefault(require("../../repositories/ExpensesRepository"));
var ConsolidateSharedExpensesService = /** @class */ (function () {
    function ConsolidateSharedExpensesService() {
    }
    ConsolidateSharedExpensesService.prototype.getBank = function (bank, amount) {
        return { id: bank.id, name: bank.name, total: amount };
    };
    ConsolidateSharedExpensesService.prototype.getPayment = function (expense) {
        return {
            id: expense.payment_type_id,
            description: expense.payment_type.description,
            banks: [this.getBank(expense.bank, expense.amount)],
            total: expense.amount
        };
    };
    ConsolidateSharedExpensesService.prototype.getCategory = function (expense) {
        return {
            id: expense.category_id,
            description: expense.category.description,
            total: expense.amount
        };
    };
    ConsolidateSharedExpensesService.prototype.getStringDate = function (date) {
        return date_fns_1.format(date, constants_1.default.dateFormat);
    };
    ConsolidateSharedExpensesService.prototype.assembleResponse = function (userId, requesterBalance, partnerBalance, requester, partner) {
        return __assign(__assign({ requester: {
                id: (requester === null || requester === void 0 ? void 0 : requester.owner_id) || userId,
                name: requester === null || requester === void 0 ? void 0 : requester.owner_name,
                payments: (requester === null || requester === void 0 ? void 0 : requester.payments) || [],
                categories: (requester === null || requester === void 0 ? void 0 : requester.categories) || [],
                total: requesterBalance
            } }, (partner === null || partner === void 0 ? void 0 : partner.owner_id) && {
            partner: {
                id: partner.owner_id,
                name: partner.owner_name,
                payments: partner === null || partner === void 0 ? void 0 : partner.payments,
                categories: (partner === null || partner === void 0 ? void 0 : partner.categories) || [],
                total: partnerBalance
            }
        }), { balance: requesterBalance - partnerBalance });
    };
    ConsolidateSharedExpensesService.prototype.consolidate = function (userId, month) {
        return __awaiter(this, void 0, void 0, function () {
            var statementPeriodRepository, statementPeriods, currentYear, initialDate, initialDateString, finalDateString, expensesRepository, expenses, consolidatedReport, requester, requesterBalance, partner, partnerBalance;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        statementPeriodRepository = typeorm_1.getRepository(StatementPeriod_1.default);
                        return [4 /*yield*/, statementPeriodRepository.find()];
                    case 1:
                        statementPeriods = _a.sent();
                        if (statementPeriods.length === 0)
                            throw new AppError_1.default(constants_1.default.errorMessages.statementPeriodToConsolidate);
                        currentYear = date_fns_1.getYear(new Date());
                        initialDate = new Date(currentYear, month, 1);
                        initialDateString = this.getStringDate(initialDate);
                        finalDateString = this.getStringDate(date_fns_1.endOfMonth(initialDate));
                        expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
                        return [4 /*yield*/, expensesRepository.createQueryBuilder('exp')
                                .innerJoinAndSelect('exp.owner', 'user')
                                .innerJoinAndSelect('exp.payment_type', 'pt')
                                .innerJoinAndSelect('exp.bank', 'bank')
                                .innerJoinAndSelect('exp.category', 'category')
                                .where('exp.personal = false')
                                .andWhere('pt.deleted_at is null')
                                .andWhere("(exp.due_date between '" + initialDateString + "' AND '" + finalDateString + "')")
                                .getMany()];
                    case 2:
                        expenses = _a.sent();
                        consolidatedReport = expenses.reduce(function (acc, expense) {
                            var _a, _b;
                            var ownerIndex = acc.findIndex(function (_a) {
                                var owner_id = _a.owner_id;
                                return owner_id === expense.owner_id;
                            });
                            if (ownerIndex >= 0) {
                                var owner = acc[ownerIndex];
                                var paymentTypeIndex = (_a = owner.payments) === null || _a === void 0 ? void 0 : _a.findIndex(function (_a) {
                                    var id = _a.id;
                                    return id === expense.payment_type_id;
                                });
                                if (paymentTypeIndex >= 0) {
                                    var bankIndex = owner.payments[paymentTypeIndex].banks.findIndex(function (bank) { return bank.id === expense.bank_id; });
                                    if (bankIndex >= 0) {
                                        owner.payments[paymentTypeIndex].banks[bankIndex].total += expense.amount;
                                    }
                                    else {
                                        owner.payments[paymentTypeIndex].banks.push(_this.getBank(expense.bank, expense.amount));
                                    }
                                    owner.payments[paymentTypeIndex].total += expense.amount;
                                }
                                else {
                                    owner.payments.push(_this.getPayment(expense));
                                }
                                var categoryIndex = (_b = owner.categories) === null || _b === void 0 ? void 0 : _b.findIndex(function (_a) {
                                    var id = _a.id;
                                    return id === expense.category_id;
                                });
                                if (categoryIndex >= 0) {
                                    owner.categories[categoryIndex].total += expense.amount;
                                }
                                else {
                                    owner.categories.push(_this.getCategory(expense));
                                }
                                owner.total += expense.amount;
                            }
                            else {
                                acc.push({
                                    owner_id: expense.owner_id,
                                    owner_name: expense.owner.name,
                                    payments: [_this.getPayment(expense)],
                                    categories: [_this.getCategory(expense)],
                                    total: expense.amount
                                });
                            }
                            return acc;
                        }, []);
                        requester = consolidatedReport.find(function (_a) {
                            var owner_id = _a.owner_id;
                            return owner_id === userId;
                        });
                        requesterBalance = requester ? requester.total : 0;
                        partner = consolidatedReport.find(function (_a) {
                            var owner_id = _a.owner_id;
                            return owner_id !== userId;
                        });
                        partnerBalance = partner ? partner.total : 0;
                        return [2 /*return*/, this.assembleResponse(userId, requesterBalance, partnerBalance, requester, partner)];
                }
            });
        });
    };
    return ConsolidateSharedExpensesService;
}());
exports.default = ConsolidateSharedExpensesService;