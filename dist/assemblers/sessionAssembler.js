"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assembleSession = void 0;
function assembleSession(_a, token) {
    var id = _a.id, name = _a.name, email = _a.email, avatar = _a.avatar, created_at = _a.created_at, updated_at = _a.updated_at;
    return { user: { id: id, name: name, email: email, avatar: avatar, created_at: created_at, updated_at: updated_at }, token: token };
}
exports.assembleSession = assembleSession;
