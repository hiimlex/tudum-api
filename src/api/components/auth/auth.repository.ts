import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../core/ErrorException";
import { User, UsersModel } from "../users";
import { IUserDocument, TOKEN_SECRET } from "../users/users.schema";
import jwt from "jsonwebtoken";
import getAuthorization from "../../../core/getAuthorizationToken";
import getAuthorizationToken from "../../../core/getAuthorizationToken";
import { handleError } from "../../../core";

class AuthRepositoryClass {
	async login(
		req: Request,
		res: Response
	): Promise<Response<{ token: string }>> {
		try {
			const { login, password } = req.body;

			const user = await UsersModel.findByCredentials(login, password);

			const token = await user.generateAuthToken();

			if (!token) {
				throw new HttpException(400, "Failed to generate token");
			}

			return res.status(200).json({ token });
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async currentUser(req: Request, res: Response): Promise<Response<User>> {
		try {
			let token = getAuthorizationToken(req);

			const user = await UsersModel.findByToken(token);

			return res.status(200).json(user.fullUser());
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async isAuthenticated(req: Request, res: Response, next: NextFunction) {
		try {
			let token = getAuthorizationToken(req);

			const user = await UsersModel.findByToken(token);

			if (!user) {
				throw new ForbiddenException();
			}

			next();
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async register(req: Request, res: Response): Promise<Response<User>> {
		try {
			const user = new UsersModel(req.body);

			await user.save();

			const token = await user.generateAuthToken();

			return res.status(201).json({ user, token });
		} catch (err: any) {
			return handleError(err, res);
		}
	}
}

class UnauthorizedException extends HttpException {
	constructor() {
		super(401, "Invalid Token");
	}
}

class ForbiddenException extends HttpException {
	constructor() {
		super(403, "Forbidden Access");
	}
}

const AuthRepository = new AuthRepositoryClass();

export { UnauthorizedException, ForbiddenException, AuthRepository };
