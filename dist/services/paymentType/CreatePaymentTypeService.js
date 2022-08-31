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
var typeorm_1 = require("typeorm");
var constants_1 = __importDefault(require("../../constants"));
var AppError_1 = __importDefault(require("../../errors/AppError"));
var PaymentType_1 = __importDefault(require("../../models/PaymentType"));
var CreatePaymentTypeService = /** @class */ (function () {
    function CreatePaymentTypeService() {
    }
    CreatePaymentTypeService.prototype.reactivatePaymentType = function (paymentTypeToRestore) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentTypesRepository;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paymentTypesRepository = typeorm_1.getRepository(PaymentType_1.default);
                        return [4 /*yield*/, paymentTypesRepository.save(__assign(__assign({}, paymentTypeToRestore), { deleted_at: null }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreatePaymentTypeService.prototype.parsePaymentType = function (_a) {
        var id = _a.id, description = _a.description, created_at = _a.created_at, updated_at = _a.updated_at, hasStatement = _a.hasStatement;
        return { id: id, description: description, created_at: created_at, updated_at: updated_at, hasStatement: hasStatement };
    };
    CreatePaymentTypeService.prototype.execute = function (description, hasStatement) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentTypeRepository, existingPaymentType, paymentType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paymentTypeRepository = typeorm_1.getRepository(PaymentType_1.default);
                        return [4 /*yield*/, paymentTypeRepository.findOne({ where: { description: description }, withDeleted: true })];
                    case 1:
                        existingPaymentType = _a.sent();
                        if (!existingPaymentType) return [3 /*break*/, 5];
                        if (!!existingPaymentType.deleted_at) return [3 /*break*/, 2];
                        throw new AppError_1.default(constants_1.default.errorMessages.existingPaymentType);
                    case 2: return [4 /*yield*/, this.reactivatePaymentType(existingPaymentType)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this.parsePaymentType(existingPaymentType)];
                    case 5:
                        paymentType = paymentTypeRepository.create({ description: description, hasStatement: hasStatement });
                        return [4 /*yield*/, paymentTypeRepository.save(paymentType)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, this.parsePaymentType(paymentType)];
                }
            });
        });
    };
    return CreatePaymentTypeService;
}());
exports.default = CreatePaymentTypeService;
