"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const api_1 = require("../../api");
const checklist_controller_1 = require("../../api/components/checklist/checklist.controller");
const users_controller_1 = require("../../api/components/users/users.controller");
class Router {
    constructor(app, apiPrefix) {
        this.app = app;
        this.apiPrefix = apiPrefix;
    }
    initRoutes() {
        this.initUsersRoutes();
        this.initAuthRoutes();
        this.initNotesRoutes();
        this.initChecklistsRoutes();
    }
    initUsersRoutes() {
        const usersController = new users_controller_1.UsersController();
        this.app.use(`${this.apiPrefix}`, usersController.router);
    }
    initAuthRoutes() {
        const authController = new api_1.AuthController();
        this.app.use(`${this.apiPrefix}`, authController.router);
    }
    initNotesRoutes() {
        const notesController = new api_1.NotesController();
        this.app.use(`${this.apiPrefix}`, notesController.router);
    }
    initChecklistsRoutes() {
        const checklistsController = new checklist_controller_1.ChecklistsController();
        this.app.use(`${this.apiPrefix}`, checklistsController.router);
    }
}
exports.Router = Router;
