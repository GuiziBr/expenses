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
var ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
var validateDate_1 = require("../middlewares/validateDate");
var validateInput_1 = require("../middlewares/validateInput");
var ExpensesRepository_1 = __importDefault(require("../repositories/ExpensesRepository"));
var CreateExpenseService_1 = __importDefault(require("../services/CreateExpenseService"));
var expensesRouter = express_1.Router();
expensesRouter.use(ensureAuthenticated_1.default);
expensesRouter.post('/', validateInput_1.validateExpense, validateDate_1.parseBodyDate, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, date, amount, category_id, personal, split, owner_id, createExpense, expense;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, description = _a.description, date = _a.date, amount = _a.amount, category_id = _a.category_id, personal = _a.personal, split = _a.split;
                owner_id = request.user.id;
                createExpense = new CreateExpenseService_1.default();
                return [4 /*yield*/, createExpense.execute({
                        owner_id: owner_id,
                        category_id: category_id,
                        description: description,
                        date: date,
                        amount: Math.round(amount * 100),
                        personal: personal,
                        split: split
                    })];
            case 1:
                expense = _b.sent();
                return [2 /*return*/, response.json(expense)];
        }
    });
}); });
expensesRouter.get('/balance', validateDate_1.validateQueryDate, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var expensesRepository, owner_id, date, parsedDate, currentBalance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
                owner_id = request.user.id;
                date = request.query.date;
                parsedDate = date ? date_fns_1.parseISO(date.toString()) : new Date();
                return [4 /*yield*/, expensesRepository.getCurrentBalance({ owner_id: owner_id, date: parsedDate })];
            case 1:
                currentBalance = _a.sent();
                return [2 /*return*/, response.json(currentBalance)];
        }
    });
}); });
expensesRouter.get('/personalBalance', validateDate_1.validateQueryDate, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var expensesRepository, owner_id, date, parsedDate, personalBalance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
                owner_id = request.user.id;
                date = request.query.date;
                parsedDate = date ? date_fns_1.parseISO(date.toString()) : new Date();
                return [4 /*yield*/, expensesRepository.getPersonalExpenses({ owner_id: owner_id, date: parsedDate })];
            case 1:
                personalBalance = _a.sent();
                return [2 /*return*/, response.json(personalBalance)];
        }
    });
}); });
exports.default = expensesRouter;
