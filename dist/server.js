"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
require("express-async-errors");
require("reflect-metadata");
var upload_1 = __importDefault(require("./config/upload"));
var constants_1 = __importDefault(require("./constants"));
require("./database");
var AppError_1 = __importDefault(require("./errors/AppError"));
var routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
var app = express_1.default();
app.use(cors_1.default({
    origin: ['https://expenses-portal.herokuapp.com', 'http://localhost:3000'],
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
var port = process.env.PORT;
app.listen(port, function () { return console.log("Server started on port " + port); });
