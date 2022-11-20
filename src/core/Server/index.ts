import express from "express";
import connection from "../../../db/connection";
import cors from "cors";
import { json } from "body-parser";
import { Router } from "../Router";

class Server {
	app!: express.Application;
	apiPrefix = process.env.API_PREFIX || "/api";

	constructor() {
		this.app = express();
		this.connectDB();

		this.middlewares();
		this.initAPIRoutes();
	}

	private initAPIRoutes(): void {
		const server = new Router(this.app, this.apiPrefix);
		server.initRoutes();
	}

	private middlewares(): void {
		this.app.use(json());
		this.app.use(cors());
	}

	private async connectDB(): Promise<any> {
		try {
			await connection.then(() => {
				console.log("Database is connected");
			});
		} catch (error: any) {
			console.error(error);
		}
	}

	listen(port: string | number): void {
		this.app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	}
}

export { Server };
