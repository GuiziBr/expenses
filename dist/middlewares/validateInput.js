"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.validateName = exports.validateId = exports.validateGetBalance = exports.validateGetExpenses = exports.validateCreateExpense = exports.validateDescription = exports.validateSession = exports.validateUser = void 0;
var date_fns_1 = require("date-fns");
var Yup = __importStar(require("yup"));
var uuid_1 = require("uuid");
var constants_1 = __importDefault(require("../constants"));
var AppError_1 = __importDefault(require("../errors/AppError"));
function parseDateString(dateValue, date) {
    return date_fns_1.isValid(date_fns_1.parseISO(date.toString())) && dateValue;
}
function validateUser(_a, _response, next) {
    var body = _a.body;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({
                        name: Yup.string().required(constants_1.default.schemaValidationErrors.nameRequired),
                        email: Yup.string().required(constants_1.default.schemaValidationErrors.emailRequired),
                        password: Yup.string().required(constants_1.default.schemaValidationErrors.passwordRequired)
                    });
                    return [4 /*yield*/, schema.validate(body, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    if (err_1 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateUser = validateUser;
function validateSession(_a, _response, next) {
    var body = _a.body;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({
                        email: Yup.string().required(constants_1.default.schemaValidationErrors.emailRequired),
                        password: Yup.string().required(constants_1.default.schemaValidationErrors.passwordRequired)
                    });
                    return [4 /*yield*/, schema.validate(body, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    if (err_2 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateSession = validateSession;
function validateDescription(_a, _response, next) {
    var body = _a.body;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({ description: Yup.string().required(constants_1.default.schemaValidationErrors.descriptionRequired) });
                    return [4 /*yield*/, schema.validate(body, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _b.sent();
                    if (err_3 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_3.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateDescription = validateDescription;
function validateCreateExpense(_a, _response, next) {
    var body = _a.body;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({
                        description: Yup.string().required(constants_1.default.schemaValidationErrors.descriptionRequired),
                        date: Yup.date().transform(parseDateString).typeError(constants_1.default.schemaValidationErrors.dateRequired),
                        amount: Yup.number().required(constants_1.default.schemaValidationErrors.amountRequired),
                        category_id: Yup.string().required(constants_1.default.schemaValidationErrors.categoryRequired),
                        personal: Yup.boolean(),
                        split: Yup.boolean(),
                        payment_type_id: Yup.string().required(constants_1.default.schemaValidationErrors.paymentTypeRequired)
                    });
                    return [4 /*yield*/, schema.validate(body, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _b.sent();
                    if (err_4 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_4.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateCreateExpense = validateCreateExpense;
function validateGetExpenses(_a, _response, next) {
    var query = _a.query;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({
                        date: Yup.date().transform(parseDateString).typeError(constants_1.default.schemaValidationErrors.dateFormat),
                        offset: Yup.number().min(0).default(1).typeError(constants_1.default.schemaValidationErrors.offsetType),
                        limit: Yup.number().min(1).max(20).default(20)
                            .typeError(constants_1.default.schemaValidationErrors.limitType)
                    });
                    return [4 /*yield*/, schema.validate(query, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _b.sent();
                    if (err_5 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_5.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateGetExpenses = validateGetExpenses;
function validateGetBalance(_a, _response, next) {
    var query = _a.query;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({ date: Yup.date().transform(parseDateString).typeError(constants_1.default.schemaValidationErrors.dateFormat) });
                    return [4 /*yield*/, schema.validate(query, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _b.sent();
                    if (err_6 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_6.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateGetBalance = validateGetBalance;
function validateId(_a, _response, next) {
    var params = _a.params;
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_b) {
            id = params.id;
            if (!uuid_1.validate(id))
                throw new AppError_1.default(constants_1.default.errorMessages.invalidRequestParam);
            return [2 /*return*/, next()];
        });
    });
}
exports.validateId = validateId;
function validateName(_a, _response, next) {
    var body = _a.body;
    return __awaiter(this, void 0, void 0, function () {
        var schema, err_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    schema = Yup.object().shape({ name: Yup.string().required(constants_1.default.schemaValidationErrors.nameRequired) });
                    return [4 /*yield*/, schema.validate(body, { abortEarly: false })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _b.sent();
                    if (err_7 instanceof Yup.ValidationError)
                        throw new AppError_1.default(err_7.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, next()];
            }
        });
    });
}
exports.validateName = validateName;
