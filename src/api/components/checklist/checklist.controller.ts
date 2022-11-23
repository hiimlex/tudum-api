import { BaseController } from "../../../core";
import { AuthRepository } from "../auth";
import { ChecklistsRepository } from "./checklist.repository";

class ChecklistsController extends BaseController {
	routePrefix = "/checklists";

	constructor() {
		super();

		this.handleRoutes();
	}

	handleRoutes(): void {
		this.router.get(this.routePrefix, [], ChecklistsRepository.index);
		this.router.get(
			this.routePrefix + "/user",
			[],
			AuthRepository.isAuthenticated,
			ChecklistsRepository.show
		);
		this.router.post(
			this.routePrefix,
			AuthRepository.isAuthenticated,
			ChecklistsRepository.createTodo
		);
		this.router.delete(
			this.routePrefix + "/:id",
			AuthRepository.isAuthenticated,
			ChecklistsRepository.deleteTodo
		);
		this.router.put(
			this.routePrefix + "/:id",
			AuthRepository.isAuthenticated,
			ChecklistsRepository.updateTodo
		);
	}
}

export { ChecklistsController };
