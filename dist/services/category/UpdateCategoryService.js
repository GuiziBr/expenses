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
var Category_1 = __importDefault(require("../../models/Category"));
var UpdateCategoryService = /** @class */ (function () {
    function UpdateCategoryService() {
    }
    UpdateCategoryService.prototype.reactivate = function (categoryIdToDelete, categoryIdToRestore) {
        return __awaiter(this, void 0, void 0, function () {
            var categoryRepository, category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        categoryRepository = typeorm_1.getRepository(Category_1.default);
                        return [4 /*yield*/, Promise.all([
                                categoryRepository.softDelete(categoryIdToDelete),
                                categoryRepository.restore(categoryIdToRestore)
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, categoryRepository.findOne(categoryIdToRestore)];
                    case 2:
                        category = _a.sent();
                        return [2 /*return*/, category || null];
                }
            });
        });
    };
    UpdateCategoryService.prototype.execute = function (_a) {
        var id = _a.id, description = _a.description;
        return __awaiter(this, void 0, void 0, function () {
            var categoryRepository, _b, category, sameDescriptionCategory, reactivatedCategory;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        categoryRepository = typeorm_1.getRepository(Category_1.default);
                        return [4 /*yield*/, Promise.all([
                                categoryRepository.findOne(id),
                                categoryRepository.findOne({ where: { description: description }, withDeleted: true })
                            ])];
                    case 1:
                        _b = _c.sent(), category = _b[0], sameDescriptionCategory = _b[1];
                        if (!category)
                            throw new AppError_1.default(constants_1.default.errorMessages.notFoundCategory, 404);
                        if (!((category && !sameDescriptionCategory) || ((sameDescriptionCategory === null || sameDescriptionCategory === void 0 ? void 0 : sameDescriptionCategory.id) === id))) return [3 /*break*/, 3];
                        return [4 /*yield*/, categoryRepository.save(__assign(__assign({}, category), { description: description, updated_at: new Date() }))];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        if (!sameDescriptionCategory) return [3 /*break*/, 5];
                        if (sameDescriptionCategory === null || sameDescriptionCategory === void 0 ? void 0 : sameDescriptionCategory.deleted_at) {
                            throw new AppError_1.default(constants_1.default.errorMessages.duplicatedCategoryDescription, 400);
                        }
                        return [4 /*yield*/, this.reactivate(id, sameDescriptionCategory.id)];
                    case 4:
                        reactivatedCategory = _c.sent();
                        if (!reactivatedCategory)
                            throw new AppError_1.default(constants_1.default.errorMessages.internalError, 500);
                        _c.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return UpdateCategoryService;
}());
exports.default = UpdateCategoryService;
