"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var typeorm_1 = require("typeorm");
var constants_1 = __importDefault(require("../constants"));
var Expense_1 = __importDefault(require("../models/Expense"));
var Types;
(function (Types) {
    Types["Income"] = "income";
    Types["Outcome"] = "outcome";
})(Types || (Types = {}));
var Order;
(function (Order) {
    Order["desc"] = "DESC";
    Order["asc"] = "ASC";
})(Order || (Order = {}));
var OrderByColumn;
(function (OrderByColumn) {
    OrderByColumn["description"] = "description";
    OrderByColumn["amount"] = "amount";
    OrderByColumn["date"] = "date";
    OrderByColumn["due_date"] = "due_date";
    OrderByColumn["category"] = "category";
    OrderByColumn["payment_type"] = "payment_type";
    OrderByColumn["bank"] = "bank";
    OrderByColumn["store"] = "store";
})(OrderByColumn || (OrderByColumn = {}));
var ExpensesRepository = /** @class */ (function (_super) {
    __extends(ExpensesRepository, _super);
    function ExpensesRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpensesRepository.prototype.assembleExpense = function (expense, owner_id, isShared) {
        return __assign(__assign(__assign(__assign({ id: expense.id, owner_id: expense.owner_id, description: expense.description, category: {
                id: expense.category.id,
                description: expense.category.description
            }, amount: expense.amount, date: expense.date, due_date: expense.due_date }, isShared && { type: expense.owner_id === owner_id ? Types.Income : Types.Outcome }), expense.payment_type && {
            payment_type: {
                id: expense.payment_type.id,
                description: expense.payment_type.description
            }
        }), expense.bank && {
            bank: {
                id: expense.bank.id,
                name: expense.bank.name
            }
        }), expense.store && {
            store: {
                id: expense.store.id,
                name: expense.store.name
            }
        });
    };
    ExpensesRepository.prototype.getSearchDateClause = function (endDate, startDate) {
        return startDate ? "expenses.date between '" + startDate + "' AND '" + endDate + "'" : "expenses.date <= " + endDate;
    };
    ExpensesRepository.prototype.getOrderByClause = function (orderBy) {
        return orderBy
            ? constants_1.default.orderColumns[orderBy]
            : constants_1.default.orderColumns.date;
    };
    ExpensesRepository.prototype.getOrderTypeClause = function (orderType) {
        return Order[orderType || 'asc'];
    };
    ExpensesRepository.prototype.getSharedExpenses = function (_a) {
        var owner_id = _a.owner_id, startDate = _a.startDate, endDate = _a.endDate, offset = _a.offset, limit = _a.limit, orderBy = _a.orderBy, orderType = _a.orderType;
        return __awaiter(this, void 0, void 0, function () {
            var _b, expenses, totalCount, typedExpenses;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.createQueryBuilder('expenses')
                            .innerJoinAndSelect('expenses.category', 'categories')
                            .innerJoinAndSelect('expenses.payment_type', 'payment_type')
                            .leftJoinAndSelect('expenses.bank', 'banks')
                            .leftJoinAndSelect('expenses.store', 'stores')
                            .where("expenses.personal = false AND " + this.getSearchDateClause(endDate, startDate))
                            .orderBy(this.getOrderByClause(orderBy), this.getOrderTypeClause(orderType))
                            .getManyAndCount()];
                    case 1:
                        _b = _c.sent(), expenses = _b[0], totalCount = _b[1];
                        typedExpenses = expenses
                            .splice(offset, limit)
                            .map(function (expense) { return _this.assembleExpense(expense, owner_id, true); });
                        return [2 /*return*/, { expenses: typedExpenses, totalCount: totalCount }];
                }
            });
        });
    };
    ExpensesRepository.prototype.findByDescriptionAndDate = function (description, date) {
        return __awaiter(this, void 0, void 0, function () {
            var isSameExpense;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne({ where: { description: description, date: date } })];
                    case 1:
                        isSameExpense = _a.sent();
                        return [2 /*return*/, isSameExpense || null];
                }
            });
        });
    };
    ExpensesRepository.prototype.getPersonalExpenses = function (_a) {
        var owner_id = _a.owner_id, startDate = _a.startDate, endDate = _a.endDate, offset = _a.offset, limit = _a.limit, orderBy = _a.orderBy, orderType = _a.orderType;
        return __awaiter(this, void 0, void 0, function () {
            var searchDateClause, _b, expenses, totalCount, formattedExpenses;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        searchDateClause = this.getSearchDateClause(endDate, startDate);
                        return [4 /*yield*/, this.createQueryBuilder('expenses')
                                .innerJoinAndSelect('expenses.category', 'categories')
                                .innerJoinAndSelect('expenses.payment_type', 'payment_type')
                                .leftJoinAndSelect('expenses.bank', 'banks')
                                .leftJoinAndSelect('expenses.store', 'stores')
                                .where("expenses.owner_id = :ownerId AND " + searchDateClause + " AND expenses.personal = true", { ownerId: owner_id })
                                .orWhere("expenses.owner_id = :ownerId AND " + searchDateClause + " AND expenses.split = true", { ownerId: owner_id })
                                .orWhere("expenses.owner_id <> :ownerId AND " + searchDateClause + " AND expenses.personal = false", { ownerId: owner_id })
                                .orderBy(this.getOrderByClause(orderBy), this.getOrderTypeClause(orderType))
                                .getManyAndCount()];
                    case 1:
                        _b = _c.sent(), expenses = _b[0], totalCount = _b[1];
                        formattedExpenses = expenses
                            .splice(offset, limit)
                            .map(function (expense) { return _this.assembleExpense(expense, owner_id); });
                        return [2 /*return*/, { expenses: formattedExpenses, totalCount: totalCount }];
                }
            });
        });
    };
    ExpensesRepository.prototype.getBalance = function (_a) {
        var owner_id = _a.owner_id, startDate = _a.startDate, endDate = _a.endDate;
        return __awaiter(this, void 0, void 0, function () {
            var searchDate, _b, personalExpenses, sharedExpenses, personalBalance, sharedBalance;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        searchDate = startDate ? typeorm_1.Between(startDate, endDate) : typeorm_1.LessThanOrEqual(endDate);
                        return [4 /*yield*/, Promise.all([
                                this.find({
                                    where: [
                                        { owner_id: owner_id, date: searchDate, personal: true },
                                        { owner_id: owner_id, date: searchDate, split: true },
                                        { owner_id: typeorm_1.Not(owner_id), date: searchDate, personal: false }
                                    ]
                                }),
                                this.find({ where: { personal: false, date: searchDate } })
                            ])];
                    case 1:
                        _b = _c.sent(), personalExpenses = _b[0], sharedExpenses = _b[1];
                        personalBalance = personalExpenses.reduce(function (acc, expense) { return acc + expense.amount; }, 0);
                        sharedBalance = sharedExpenses.reduce(function (acc, expense) {
                            if (expense.owner_id === owner_id)
                                acc.paying += expense.amount;
                            else
                                acc.payed += expense.amount;
                            return acc;
                        }, { paying: 0, payed: 0, total: 0 });
                        return [2 /*return*/, {
                                personalBalance: personalBalance,
                                sharedBalance: { total: sharedBalance.paying - sharedBalance.payed, paying: sharedBalance.paying, payed: sharedBalance.payed }
                            }];
                }
            });
        });
    };
    ExpensesRepository = __decorate([
        typeorm_1.EntityRepository(Expense_1.default)
    ], ExpensesRepository);
    return ExpensesRepository;
}(typeorm_1.Repository));
exports.default = ExpensesRepository;
