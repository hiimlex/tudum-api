import { Application } from "express";
import { AuthController } from "../../api";
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
	}

	initUsersRoutes(): void {
		const usersController = new UsersController();
		this.app.use(`${this.apiPrefix}`, usersController.router);
	}

	initAuthRoutes(): void {
		const authController = new AuthController();
		this.app.use(`${this.apiPrefix}`, authController.router);
	}
}

export { Router };
