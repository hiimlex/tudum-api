import { Request } from "express";

function getAuthorization(req: Request): string {
	let token = req.headers.authorization;

	if (!token) {
		token = "";
	}

	token = token.replace("Bearer", "").trim();

	return token;
}

export default getAuthorization;
