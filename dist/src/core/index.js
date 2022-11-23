"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.getAuthorizationToken = void 0;
__exportStar(require("./BaseController"), exports);
__exportStar(require("./Router"), exports);
__exportStar(require("./Server"), exports);
var getAuthorizationToken_1 = require("./getAuthorizationToken");
Object.defineProperty(exports, "getAuthorizationToken", { enumerable: true, get: function () { return __importDefault(getAuthorizationToken_1).default; } });
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "handleError", { enumerable: true, get: function () { return __importDefault(errorHandler_1).default; } });
