"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsController = void 0;
const core_1 = require("../../../core");
const auth_1 = require("../auth");
const checklist_repository_1 = require("./checklist.repository");
class ChecklistsController extends core_1.BaseController {
    constructor() {
        super();
        this.routePrefix = "/checklists";
        this.handleRoutes();
    }
    handleRoutes() {
        this.router.get(this.routePrefix, [], checklist_repository_1.ChecklistsRepository.index);
        this.router.get(this.routePrefix + "/user", [], auth_1.AuthRepository.isAuthenticated, checklist_repository_1.ChecklistsRepository.show);
        this.router.post(this.routePrefix, auth_1.AuthRepository.isAuthenticated, checklist_repository_1.ChecklistsRepository.createTodo);
        this.router.delete(this.routePrefix + "/:id", auth_1.AuthRepository.isAuthenticated, checklist_repository_1.ChecklistsRepository.deleteTodo);
        this.router.put(this.routePrefix + "/:id", auth_1.AuthRepository.isAuthenticated, checklist_repository_1.ChecklistsRepository.updateTodo);
    }
}
exports.ChecklistsController = ChecklistsController;
