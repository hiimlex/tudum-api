import UsersRepository from "./users.repository";
import { BaseController } from "../../../core";
import { AuthRepository } from "../auth";

class UsersController extends BaseController {
	routePrefix = "/users";

	constructor() {
		super();

		this.handleRoutes();
	}

	handleRoutes(): void {
		this.router.get(this.routePrefix, [], UsersRepository.index);
		this.router.get(
			`${this.routePrefix}`,
			[],
			AuthRepository.isAuthenticated,
			UsersRepository.index
		);
		this.router.post(this.routePrefix, UsersRepository.create);
		this.router.put(
			this.routePrefix,
			AuthRepository.isAuthenticated,
			UsersRepository.update
		);
		this.router.delete(
			this.routePrefix,
			AuthRepository.isAuthenticated,
			UsersRepository.delete
		);
	}
}

export { UsersController };
