"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAuthorization(req) {
    let token = req.headers.authorization;
    if (!token) {
        token = "";
    }
    token = token.replace("Bearer", "").trim();
    return token;
}
exports.default = getAuthorization;
