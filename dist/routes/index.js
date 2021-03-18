"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var categories_routes_1 = __importDefault(require("./categories.routes"));
var expenses_routes_1 = __importDefault(require("./expenses.routes"));
var sessions_routes_1 = __importDefault(require("./sessions.routes"));
var users_routes_1 = __importDefault(require("./users.routes"));
var routes = express_1.Router();
routes.use('/expenses', expenses_routes_1.default);
routes.use('/users', users_routes_1.default);
routes.use('/sessions', sessions_routes_1.default);
routes.use('/categories', categories_routes_1.default);
exports.default = routes;
