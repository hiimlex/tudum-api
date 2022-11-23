"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = exports.ForbiddenException = exports.UnauthorizedException = void 0;
const ErrorException_1 = require("../../../core/ErrorException");
const users_1 = require("../users");
const getAuthorizationToken_1 = __importDefault(require("../../../core/getAuthorizationToken"));
const core_1 = require("../../../core");
class AuthRepositoryClass {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body;
                const user = yield users_1.UsersModel.findByCredentials(login, password);
                const token = yield user.generateAuthToken();
                if (!token) {
                    throw new ErrorException_1.HttpException(400, "Failed to generate token");
                }
                return res.status(200).json({ token });
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    currentUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = (0, getAuthorizationToken_1.default)(req);
                const user = yield users_1.UsersModel.findByToken(token);
                return res.status(200).json(user.fullUser());
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    isAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = (0, getAuthorizationToken_1.default)(req);
                const user = yield users_1.UsersModel.findByToken(token);
                if (!user) {
                    throw new ForbiddenException();
                }
                next();
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = new users_1.UsersModel(req.body);
                yield user.save();
                const token = yield user.generateAuthToken();
                return res.status(201).json({ user, token });
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
}
class UnauthorizedException extends ErrorException_1.HttpException {
    constructor() {
        super(401, "Invalid Token");
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends ErrorException_1.HttpException {
    constructor() {
        super(403, "Forbidden Access");
    }
}
exports.ForbiddenException = ForbiddenException;
const AuthRepository = new AuthRepositoryClass();
exports.AuthRepository = AuthRepository;
