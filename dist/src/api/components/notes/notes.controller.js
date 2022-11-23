"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesController = void 0;
const core_1 = require("../../../core");
const auth_1 = require("../auth");
const notes_repository_1 = require("./notes.repository");
class NotesController extends core_1.BaseController {
    constructor() {
        super();
        this.routePrefix = "/notes";
        this.handleRoutes();
    }
    handleRoutes() {
        this.router.get(this.routePrefix, [], notes_repository_1.NotesRepository.index);
        this.router.get(this.routePrefix + "/user", [], auth_1.AuthRepository.isAuthenticated, notes_repository_1.NotesRepository.show);
        this.router.post(this.routePrefix, auth_1.AuthRepository.isAuthenticated, notes_repository_1.NotesRepository.create);
        this.router.delete(this.routePrefix + "/:id", auth_1.AuthRepository.isAuthenticated, notes_repository_1.NotesRepository.delete);
        this.router.put(this.routePrefix + "/:id", auth_1.AuthRepository.isAuthenticated, notes_repository_1.NotesRepository.update);
        this.router.put(this.routePrefix + "/favorite/:id", auth_1.AuthRepository.isAuthenticated, notes_repository_1.NotesRepository.favorite);
    }
}
exports.NotesController = NotesController;
