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
var express_1 = require("express");
var typeorm_1 = require("typeorm");
var constants_1 = __importDefault(require("../constants"));
var ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
var parseDate_1 = require("../middlewares/parseDate");
var validateInput_1 = require("../middlewares/validateInput");
var ExpensesRepository_1 = __importDefault(require("../repositories/ExpensesRepository"));
var CreateExpenseService_1 = __importDefault(require("../services/CreateExpenseService"));
var expensesRouter = express_1.Router();
expensesRouter.use(ensureAuthenticated_1.default);
expensesRouter.post('/', validateInput_1.validateCreateExpense, parseDate_1.parseBodyDate, function (_a, response) {
    var user = _a.user, body = _a.body;
    return __awaiter(void 0, void 0, void 0, function () {
        var owner_id, description, date, amount, category_id, personal, split, payment_type_id, createExpense, expense;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    owner_id = user.id;
                    description = body.description, date = body.date, amount = body.amount, category_id = body.category_id, personal = body.personal, split = body.split, payment_type_id = body.payment_type_id;
                    createExpense = new CreateExpenseService_1.default();
                    return [4 /*yield*/, createExpense.execute({
                            owner_id: owner_id,
                            category_id: category_id,
                            description: description,
                            date: date,
                            amount: Math.round(amount * 100),
                            personal: personal,
                            split: split,
                            payment_type_id: payment_type_id
                        })];
                case 1:
                    expense = _b.sent();
                    return [2 /*return*/, response.json(expense)];
            }
        });
    });
});
expensesRouter.get('/shared', validateInput_1.validateGetExpenses, function (_a, response) {
    var user = _a.user, query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var expensesRepository, owner_id, date, _b, offset, _c, limit, parsedDate, _d, expenses, totalCount;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
                    owner_id = user.id;
                    date = query.date, _b = query.offset, offset = _b === void 0 ? constants_1.default.defaultOffset : _b, _c = query.limit, limit = _c === void 0 ? constants_1.default.defaultLimit : _c;
                    parsedDate = date ? date_fns_1.parseISO(date.toString()) : new Date();
                    return [4 /*yield*/, expensesRepository.getSharedExpenses({
                            owner_id: owner_id,
                            date: parsedDate,
                            offset: Number(offset),
                            limit: Number(limit)
                        })];
                case 1:
                    _d = _e.sent(), expenses = _d.expenses, totalCount = _d.totalCount;
                    response.setHeader(constants_1.default.headerTypes.totalCount, totalCount);
                    return [2 /*return*/, response.json(expenses)];
            }
        });
    });
});
expensesRouter.get('/personal', validateInput_1.validateGetExpenses, function (_a, response) {
    var user = _a.user, query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var expensesRepository, owner_id, date, _b, offset, _c, limit, parsedDate, _d, expenses, totalCount;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
                    owner_id = user.id;
                    date = query.date, _b = query.offset, offset = _b === void 0 ? constants_1.default.defaultOffset : _b, _c = query.limit, limit = _c === void 0 ? constants_1.default.defaultLimit : _c;
                    parsedDate = date ? date_fns_1.parseISO(date.toString()) : new Date();
                    return [4 /*yield*/, expensesRepository.getPersonalExpenses({
                            owner_id: owner_id,
                            date: parsedDate,
                            offset: Number(offset),
                            limit: Number(limit)
                        })];
                case 1:
                    _d = _e.sent(), expenses = _d.expenses, totalCount = _d.totalCount;
                    response.setHeader(constants_1.default.headerTypes.totalCount, totalCount);
                    return [2 /*return*/, response.json(expenses)];
            }
        });
    });
});
exports.default = expensesRouter;
