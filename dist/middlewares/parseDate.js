"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBodyDate = void 0;
var date_fns_1 = require("date-fns");
function parseBodyDate(request, _response, next) {
    var date = request.body.date;
    request.body.date = date_fns_1.parseISO(date);
    return next();
}
exports.parseBodyDate = parseBodyDate;
