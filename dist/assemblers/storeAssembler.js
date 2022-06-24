"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAssembleUser = void 0;
function storeAssembleUser(_a) {
    var id = _a.id, name = _a.name, created_at = _a.created_at, updated_at = _a.updated_at;
    return { id: id, name: name, created_at: created_at, updated_at: updated_at };
}
exports.storeAssembleUser = storeAssembleUser;
