import UsersRepository from "./users.repository";
import { BaseController } from "../../../core";

class UsersController extends BaseController {
	routePrefix = "/users";

	constructor() {
		super();

		this.handleRoutes();
	}

	handleRoutes(): void {
		this.router.get(this.routePrefix, UsersRepository.index);
		this.router.post(this.routePrefix, UsersRepository.create);
		this.router.put(`${this.routePrefix}/:id`, UsersRepository.update);
		this.router.delete(`${this.routePrefix}/:id`, UsersRepository.delete);
	}
}

export { UsersController };
