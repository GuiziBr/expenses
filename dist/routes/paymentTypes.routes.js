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
var express_1 = require("express");
var typeorm_1 = require("typeorm");
var constants_1 = __importDefault(require("../constants"));
var AppError_1 = __importDefault(require("../errors/AppError"));
var ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
var validateInput_1 = require("../middlewares/validateInput");
var PaymentType_1 = __importDefault(require("../models/PaymentType"));
var CreatePaymentTypeService_1 = __importDefault(require("../services/paymentType/CreatePaymentTypeService"));
var UpdatePaymentTypeService_1 = __importDefault(require("../services/paymentType/UpdatePaymentTypeService"));
var paymentTypeAssembler_1 = require("../assemblers/paymentTypeAssembler");
var paymentTypeRouter = express_1.Router();
paymentTypeRouter.use(ensureAuthenticated_1.default);
paymentTypeRouter.get('/', function (_request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentTypesRepository, paymentTypes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paymentTypesRepository = typeorm_1.getRepository(PaymentType_1.default);
                return [4 /*yield*/, paymentTypesRepository.find({ where: { deleted_at: typeorm_1.IsNull() } })];
            case 1:
                paymentTypes = _a.sent();
                return [2 /*return*/, response.json(paymentTypes.map(paymentTypeAssembler_1.paymentTypeAssembleUser))];
        }
    });
}); });
paymentTypeRouter.get('/:id', validateInput_1.validateId, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, paymentTypesRepository, paymentType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                paymentTypesRepository = typeorm_1.getRepository(PaymentType_1.default);
                return [4 /*yield*/, paymentTypesRepository.findOne({ where: { id: id, deleted_at: typeorm_1.IsNull() } })];
            case 1:
                paymentType = _a.sent();
                if (!paymentType)
                    throw new AppError_1.default(constants_1.default.errorMessages.notFoundPaymentType, 404);
                return [2 /*return*/, response.json(paymentTypeAssembler_1.paymentTypeAssembleUser(paymentType))];
        }
    });
}); });
paymentTypeRouter.post('/', validateInput_1.validateDescription, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var description, createPaymentType, paymentType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                description = request.body.description;
                createPaymentType = new CreatePaymentTypeService_1.default();
                return [4 /*yield*/, createPaymentType.execute(description)];
            case 1:
                paymentType = _a.sent();
                return [2 /*return*/, response.status(201).json(paymentType)];
        }
    });
}); });
paymentTypeRouter.patch('/:id', validateInput_1.validateId, validateInput_1.validateDescription, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, description, updatePaymentType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                description = request.body.description;
                updatePaymentType = new UpdatePaymentTypeService_1.default();
                return [4 /*yield*/, updatePaymentType.execute(id, description)];
            case 1:
                _a.sent();
                return [2 /*return*/, response.status(204).json()];
        }
    });
}); });
paymentTypeRouter.delete('/:id', validateInput_1.validateId, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, paymentTypesRepository, existingPaymentType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                paymentTypesRepository = typeorm_1.getRepository(PaymentType_1.default);
                return [4 /*yield*/, paymentTypesRepository.findOne(id)];
            case 1:
                existingPaymentType = _a.sent();
                if (!existingPaymentType || existingPaymentType.deleted_at)
                    return [2 /*return*/, response.status(204).json()];
                return [4 /*yield*/, paymentTypesRepository.update(id, { deleted_at: new Date() })];
            case 2:
                _a.sent();
                return [2 /*return*/, response.status(204).json()];
        }
    });
}); });
exports.default = paymentTypeRouter;
