import { Request, Response } from "express";
import { getAuthorizationToken, handleError } from "../../../core";
import { HttpException } from "../../../core/ErrorException";
import { User, UsersModel } from "./users.model";

class UsersRepository {
	async index(req: Request, res: Response): Promise<Response<User[]>> {
		try {
			const users = await UsersModel.find({});

			return res.status(200).json(users);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async show(req: Request, res: Response): Promise<Response<User>> {
		try {
			const id = req.params.id;

			const user = await UsersModel.findById(id);

			if (!user) {
				throw new HttpException(404, "User not found");
			}

			return res.status(200).json(user);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async create(req: Request, res: Response): Promise<Response<User>> {
		try {
			const data = req.body;

			const newUser = await UsersModel.create(data);

			await newUser.save();

			return res.status(201).json(newUser);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async update(req: Request, res: Response): Promise<Response<null>> {
		try {
			const token = getAuthorizationToken(req);

			const user = await UsersModel.findByToken(token);

			const data = req.body;

			if (!user) {
				throw new HttpException(404, "User not found");
			}

			await user.updateOne(data);
			await user.save();

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<null>> {
		try {
			const token = getAuthorizationToken(req);

			const user = await UsersModel.findByToken(token);

			if (!user) {
				throw new HttpException(404, "User not found");
			}

			await user.deleteOne();

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}
}

export default new UsersRepository();
