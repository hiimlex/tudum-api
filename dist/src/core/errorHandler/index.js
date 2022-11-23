"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorException_1 = require("../ErrorException");
function handleError(err, res) {
    if (err instanceof ErrorException_1.HttpException) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message });
}
exports.default = handleError;
