"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const core_1 = require("../../../core");
const auth_repository_1 = require("./auth.repository");
class AuthController extends core_1.BaseController {
    constructor() {
        super();
        this.routePrefix = "/auth";
        this.handleRoutes();
    }
    handleRoutes() {
        this.router.post(this.routePrefix + "/login", auth_repository_1.AuthRepository.login);
        this.router.get(this.routePrefix + "/currentUser", [], auth_repository_1.AuthRepository.isAuthenticated, auth_repository_1.AuthRepository.currentUser);
        this.router.post(this.routePrefix + "/register", auth_repository_1.AuthRepository.register);
    }
}
exports.AuthController = AuthController;
