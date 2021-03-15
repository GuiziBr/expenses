"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function user(_a) {
    var id = _a.id, name = _a.name, email = _a.email, avatar = _a.avatar, created_at = _a.created_at, updated_at = _a.updated_at;
    return { id: id, name: name, email: email, avatar: avatar, created_at: created_at, updated_at: updated_at };
}
exports.default = user;
