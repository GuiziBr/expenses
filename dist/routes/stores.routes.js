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
var constants_1 = __importDefault(require("../constants"));
var AppError_1 = __importDefault(require("../errors/AppError"));
var ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
var validateInput_1 = require("../middlewares/validateInput");
var CreateStoreService_1 = __importDefault(require("../services/store/CreateStoreService"));
var DeleteStoreService_1 = __importDefault(require("../services/store/DeleteStoreService"));
var GetStoreService_1 = __importDefault(require("../services/store/GetStoreService"));
var UpdateStoreService_1 = __importDefault(require("../services/store/UpdateStoreService"));
var storesRouter = express_1.Router();
storesRouter.use(ensureAuthenticated_1.default);
storesRouter.get('/', validateInput_1.validateListRoutes, function (_a, response) {
    var query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var offset, limit, getStoreService, _b, stores, totalCount;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    offset = query.offset, limit = query.limit;
                    getStoreService = new GetStoreService_1.default();
                    return [4 /*yield*/, getStoreService.list(Number(offset), Number(limit))];
                case 1:
                    _b = _c.sent(), stores = _b.stores, totalCount = _b.totalCount;
                    response.setHeader(constants_1.default.headerTypes.totalCount, totalCount);
                    return [2 /*return*/, response.json(stores)];
            }
        });
    });
});
storesRouter.get('/:id', validateInput_1.validateId, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, getStoreService, store;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                getStoreService = new GetStoreService_1.default();
                return [4 /*yield*/, getStoreService.getById(id)];
            case 1:
                store = _a.sent();
                if (!store)
                    throw new AppError_1.default(constants_1.default.errorMessages.notFoundStore, 404);
                return [2 /*return*/, response.json(store)];
        }
    });
}); });
storesRouter.patch('/:id', validateInput_1.validateId, validateInput_1.validateName, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, name, updateStore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                name = request.body.name;
                updateStore = new UpdateStoreService_1.default();
                return [4 /*yield*/, updateStore.execute(id, name)];
            case 1:
                _a.sent();
                return [2 /*return*/, response.status(204).json()];
        }
    });
}); });
storesRouter.post('/', validateInput_1.validateName, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var name, createStore, bank;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = request.body.name;
                createStore = new CreateStoreService_1.default();
                return [4 /*yield*/, createStore.execute(name)];
            case 1:
                bank = _a.sent();
                return [2 /*return*/, response.status(201).json(bank)];
        }
    });
}); });
storesRouter.delete('/:id', validateInput_1.validateId, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleteStoreService;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                deleteStoreService = new DeleteStoreService_1.default();
                return [4 /*yield*/, deleteStoreService.execute(id)];
            case 1:
                _a.sent();
                return [2 /*return*/, response.status(204).json()];
        }
    });
}); });
exports.default = storesRouter;
