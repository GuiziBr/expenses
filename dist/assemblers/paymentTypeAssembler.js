"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentTypeAssembleUser = void 0;
function paymentTypeAssembleUser(_a) {
    var id = _a.id, description = _a.description, created_at = _a.created_at, updated_at = _a.updated_at;
    return { id: id, description: description, created_at: created_at, updated_at: updated_at };
}
exports.paymentTypeAssembleUser = paymentTypeAssembleUser;
