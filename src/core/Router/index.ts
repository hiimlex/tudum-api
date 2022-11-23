import { Application } from "express";
import { AuthController, NotesController } from "../../api";
import { ChecklistsController } from "../../api/components/checklist/checklist.controller";
import { UsersController } from "../../api/components/users/users.controller";

class Router {
	app!: Application;
	apiPrefix!: string;

	constructor(app: Application, apiPrefix: string) {
		this.app = app;
		this.apiPrefix = apiPrefix;
	}

	initRoutes(): void {
		this.initUsersRoutes();
		this.initAuthRoutes();
		this.initNotesRoutes();
		this.initChecklistsRoutes();
	}

	initUsersRoutes(): void {
		const usersController = new UsersController();
		this.app.use(`${this.apiPrefix}`, usersController.router);
		this.app.get("/", (req, res) => {
			res.send("Hello World");
		});
	}

	initAuthRoutes(): void {
		const authController = new AuthController();
		this.app.use(`${this.apiPrefix}`, authController.router);
	}

	initNotesRoutes(): void {
		const notesController = new NotesController();
		this.app.use(`${this.apiPrefix}`, notesController.router);
	}

	initChecklistsRoutes(): void {
		const checklistsController = new ChecklistsController();
		this.app.use(`${this.apiPrefix}`, checklistsController.router);
	}
}

export { Router };
