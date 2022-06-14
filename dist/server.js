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
var cors_1 = __importDefault(require("cors"));
var cron_1 = require("cron");
var date_fns_1 = require("date-fns");
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
require("express-async-errors");
require("reflect-metadata");
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var express_openapi_validator_1 = require("express-openapi-validator");
var api_schema_json_1 = __importDefault(require("./api.schema.json"));
var upload_1 = __importDefault(require("./config/upload"));
var constants_1 = __importDefault(require("./constants"));
require("./database");
var AppError_1 = __importDefault(require("./errors/AppError"));
var routes_1 = __importDefault(require("./routes"));
var ReportService_1 = __importDefault(require("./services/report/ReportService"));
dotenv_1.default.config();
var app = express_1.default();
app.use(cors_1.default({
    origin: constants_1.default.corsOrigins,
    exposedHeaders: constants_1.default.headerTypes.totalCount
}));
app.use(express_1.default.json());
app.use('/files', express_1.default.static(upload_1.default.directory));
app.use(routes_1.default);
app.use(function (err, _request, response, _) {
    if (err instanceof AppError_1.default)
        return response.status(err.statusCode).json({ status: 'error', message: err.message });
    console.error(err);
    return response.status(500).json({ status: 'error', message: constants_1.default.errorMessages.internalError });
});
function docSetup() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.use('/doc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(api_schema_json_1.default));
                    return [4 /*yield*/, new express_openapi_validator_1.OpenApiValidator({
                            apiSpec: api_schema_json_1.default,
                            validateRequests: true,
                            validateResponses: true
                        }).install(app)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var sendEmailJob = new cron_1.CronJob(constants_1.default.cronJobTime, function () { return __awaiter(void 0, void 0, void 0, function () {
    var reportService;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!date_fns_1.isLastDayOfMonth(new Date())) return [3 /*break*/, 2];
                reportService = new ReportService_1.default();
                return [4 /*yield*/, reportService.execute()];
            case 1:
                _a.sent();
                console.log("CronJob executed at " + new Date());
                return [2 /*return*/, true];
            case 2: return [2 /*return*/, false];
        }
    });
}); }, null, false, constants_1.default.cronJobTimeZone);
var port = process.env.PORT;
app.listen(port, function () {
    console.log("Server started on port " + port);
    sendEmailJob.start();
    docSetup();
});
