"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const users_repository_1 = __importDefault(require("./users.repository"));
const core_1 = require("../../../core");
const auth_1 = require("../auth");
class UsersController extends core_1.BaseController {
    constructor() {
        super();
        this.routePrefix = "/users";
        this.handleRoutes();
    }
    handleRoutes() {
        this.router.get(this.routePrefix, [], users_repository_1.default.index);
        this.router.get(`${this.routePrefix}`, [], auth_1.AuthRepository.isAuthenticated, users_repository_1.default.index);
        this.router.post(this.routePrefix, users_repository_1.default.create);
        this.router.put(this.routePrefix, auth_1.AuthRepository.isAuthenticated, users_repository_1.default.update);
        this.router.delete(this.routePrefix, auth_1.AuthRepository.isAuthenticated, users_repository_1.default.delete);
    }
}
exports.UsersController = UsersController;
