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
var constants_1 = __importDefault(require("../../constants"));
var User_1 = __importDefault(require("../../models/User"));
var ExpensesRepository_1 = __importDefault(require("../../repositories/ExpensesRepository"));
var formatAmount_1 = require("../../utils/formatAmount");
var EmailService_1 = __importDefault(require("./EmailService"));
var ReportService = /** @class */ (function () {
    function ReportService() {
        this.usersRepository = typeorm_1.getRepository(User_1.default);
        this.expensesRepository = typeorm_1.getCustomRepository(ExpensesRepository_1.default);
        this.reportDate = new Date();
        this.emailService = new EmailService_1.default();
    }
    ReportService.prototype.buildReport = function (balance, to, name) {
        var text = "\n      Dear " + name + ",\n\n      Monthly Report - " + date_fns_1.format(this.reportDate, 'yyyy/MM') + "\n\n      Shared Balance:\n      Your Incomes are " + formatAmount_1.formatAmount(balance.sharedBalance.paying) + "\n      Your Outcomes are " + formatAmount_1.formatAmount(balance.sharedBalance.payed) + "\n      Your Current Balance is " + formatAmount_1.formatAmount(balance.sharedBalance.total) + "\n\n      Your Current Personal Balance is " + formatAmount_1.formatAmount(balance.personalBalance) + "\n\n      Please bear in mind that your deadline for registering new expenses is up to today at 23h59, consider taking a moment to check your expenses\n\n      To see more details visit https://expenses-portal.herokuapp.com/\n\n      Regards,\n\n      Admin\n    ";
        return { to: to, subject: constants_1.default.reportSubject, text: text };
    };
    ReportService.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, balances, reports;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.find()];
                    case 1:
                        users = _a.sent();
                        return [4 /*yield*/, Promise.all([
                                this.expensesRepository.getBalance({ owner_id: users[0].id, endDate: this.reportDate.toString(), startDate: this.reportDate.toString() }),
                                this.expensesRepository.getBalance({ owner_id: users[1].id, endDate: this.reportDate.toString(), startDate: this.reportDate.toString() })
                            ])];
                    case 2:
                        balances = _a.sent();
                        reports = balances.map(function (balance, index) { return _this.buildReport(balance, users[index].email, users[index].name); });
                        return [2 /*return*/, Promise.all(reports.map(function (report) { return _this.emailService.execute(report); }))];
                }
            });
        });
    };
    return ReportService;
}());
exports.default = ReportService;
