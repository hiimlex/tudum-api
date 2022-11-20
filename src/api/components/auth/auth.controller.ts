import { BaseController } from "../../../core";
import { AuthRepository } from "./auth.repository";

class AuthController extends BaseController {
	routePrefix = "/auth";

	constructor() {
		super();

		this.handleRoutes();
	}

	handleRoutes(): void {
		this.router.post(this.routePrefix + "/login", AuthRepository.login);
		this.router.get(
			this.routePrefix + "/currentUser",
			[],
			AuthRepository.isAuthenticated,
			AuthRepository.currentUser
		);
	}
}

export { AuthController };
