import { Request, Response } from "express";
import { getAuthorizationToken, handleError } from "../../../core";
import { HttpException } from "../../../core/ErrorException";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { TodoModel } from "../todo";
import { UsersModel } from "../users";
import { Checklist, ChecklistsModel } from "./checklist.model";

class ChecklistsRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<Checklist[]>> {
		try {
			const checklists = await ChecklistsModel.find({})
				.populate("todos")
				.populate("owner", "name _id");

			return res.status(200).json(checklists);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async show(req: Request, res: Response): Promise<Response<Checklist>> {
		try {
			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const checklist = await ChecklistsModel.findOne({
				owner: authenticatedUser._id,
			})
				.populate("todos")
				.populate("owner", "name _id");

			return res.status(200).json(checklist);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async createTodo(req: Request, res: Response): Promise<Response<null>> {
		try {
			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const data = req.body;

			const todo = await TodoModel.create({
				owner: authenticatedUser._id,
				...data,
			});

			await todo.save();

			let checklist = await ChecklistsModel.findOne({
				owner: authenticatedUser._id,
			})
				.populate("owner")
				.populate("todos");

			if (checklist) {
				if (
					(checklist as any).owner._id.toHexString() !==
					authenticatedUser._id.toHexString()
				) {
					throw new ForbiddenException();
				}

				await checklist.update({ $push: { todos: todo._id } });

				await checklist.save();

				return res.status(204).json(null);
			} else {
				const newChecklist = await ChecklistsModel.create({
					owner: authenticatedUser._id,
					todos: [todo._id],
				});

				await newChecklist.save();

				return res.status(201).json(null);
			}
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async deleteTodo(req: Request, res: Response): Promise<Response<null>> {
		try {
			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const checklist = await ChecklistsModel.findOne({
				owner: authenticatedUser._id,
			})
				.populate("todos")
				.populate("owner", "name _id");

			if (!checklist) {
				throw new HttpException(404, "Checklist not found");
			}

			if (
				(checklist as any).owner._id.toHexString() !==
				authenticatedUser._id.toHexString()
			) {
				throw new ForbiddenException();
			}

			const id = req.params.id;

			await checklist.updateOne({ $pull: { todos: id } });

			const todo = await TodoModel.findById(id);

			if (!todo) {
				throw new HttpException(404, "Todo not found");
			}

			await todo.deleteOne();

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async updateTodo(req: Request, res: Response): Promise<Response<null>> {
		try {
			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const checklist = await ChecklistsModel.findOne({
				owner: authenticatedUser._id,
			})
				.populate("todos")
				.populate("owner", "name _id");

			if (!checklist) {
				throw new HttpException(404, "Checklist not found");
			}

			if (
				(checklist as any).owner._id.toHexString() !==
				authenticatedUser._id.toHexString()
			) {
				throw new ForbiddenException();
			}

			const id = req.params.id;

			const todo = await TodoModel.findById(id);

			if (!todo) {
				throw new HttpException(404, "Todo not found");
			}

			const body = req.body;

			if (body.done) {
				body.doneDate = new Date().toISOString();
			} else {
				body.doneDate = null;
			}

			await todo.updateOne(body);

			await todo.save();

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}
}

const ChecklistsRepository = new ChecklistsRepositoryClass();

export { ChecklistsRepository };
