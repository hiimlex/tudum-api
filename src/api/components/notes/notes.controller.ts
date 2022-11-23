import { BaseController } from "../../../core";
import { AuthRepository } from "../auth";
import { NotesRepository } from "./notes.repository";

class NotesController extends BaseController {
	routePrefix = "/notes";

	constructor() {
		super();

		this.handleRoutes();
	}

	handleRoutes(): void {
		this.router.get(this.routePrefix, [], NotesRepository.index);
		this.router.get(
			this.routePrefix + "/user",
			[],
			AuthRepository.isAuthenticated,
			NotesRepository.show
		);
		this.router.post(
			this.routePrefix,
			AuthRepository.isAuthenticated,
			NotesRepository.create
		);
		this.router.delete(
			this.routePrefix + "/:id",
			AuthRepository.isAuthenticated,
			NotesRepository.delete
		);
		this.router.put(
			this.routePrefix + "/:id",
			AuthRepository.isAuthenticated,
			NotesRepository.update
		);
		this.router.put(
			this.routePrefix + "/favorite/:id",
			AuthRepository.isAuthenticated,
			NotesRepository.favorite
		);
	}
}

export { NotesController };
