import { Request, Response } from "express";
import { getAuthorizationToken, handleError } from "../../../core";
import { HttpException } from "../../../core/ErrorException";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { UsersModel } from "../users";
import { Note, NotesFilter, NotesModel } from "./notes.model";

class NotesRepositoryClass {
	async index(req: Request, res: Response): Promise<Response<Note[]>> {
		try {
			const filter = req.query;

			const query: NotesFilter = {};

			if (filter.title) {
				query.title = { $regex: filter.title, $options: "i" };
			}

			if (filter.content) {
				query.content = { $regex: filter.content, $options: "i" };
			}

			if (filter.favorite) {
				query.favorite = filter.favorite === "true";
			}

			const notes = await NotesModel.find(query).populate("owner", "name");

			return res.status(200).json(notes);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async show(req: Request, res: Response): Promise<Response<Note[]>> {
		try {
			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const filter = req.query;

			const query: NotesFilter = {};
			const pagination: any = {};

			if (filter.title) {
				query.title = { $regex: filter.title, $options: "i" };
			}

			if (filter.content) {
				query.content = { $regex: filter.content, $options: "i" };
			}

			if (filter.favorite) {
				query.favorite = filter.favorite === "true";
			}

			if (filter.limit) {
				pagination.limit = parseInt(filter.limit as string);
			}

			if (filter.offset) {
				pagination.skip = parseInt(filter.offset as string);
			}

			const count = await NotesModel.find({
				owner: authenticatedUser.id,
				...query,
			}).countDocuments();

			const notes = await NotesModel.find({
				owner: authenticatedUser._id,
				...query,
			})
				.skip(pagination.skip || null)
				.limit(pagination.limit || null)
				.populate("owner", "name");

			return res.status(200).json({
				data: notes,
				totalItems: count,
				totalPages: Math.ceil(count / (pagination.limit || 10)),
				filter: query,
				page: pagination.skip
					? Math.floor(pagination.skip / pagination.limit + 1)
					: 1,
				limit: pagination.limit,
				offset: pagination.skip,
			});
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async create(req: Request, res: Response): Promise<Response<null>> {
		try {
			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (!authenticatedUser) {
				throw new UnauthorizedException();
			}

			const data = req.body;
			data.owner = authenticatedUser._id;

			const note = await NotesModel.create(data);
			await note.save();

			return res.status(201).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<null>> {
		try {
			const id = req.params.id;

			const note = await NotesModel.findById(id).populate("owner", "id");

			if (!note) {
				throw new HttpException(404, "Note not found");
			}

			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (
				(note as any).owner._id.toHexString() !==
				authenticatedUser._id.toHexString()
			) {
				throw new ForbiddenException();
			}

			await note.deleteOne();

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async update(req: Request, res: Response): Promise<Response<null>> {
		try {
			const id = req.params.id;

			const note = await NotesModel.findById(id).populate("owner", "id");

			if (!note) {
				throw new HttpException(404, "Note not found");
			}

			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (
				(note as any).owner._id.toHexString() !==
				authenticatedUser._id.toHexString()
			) {
				throw new ForbiddenException();
			}

			const data = req.body;

			await note.updateOne(data);

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}

	async favorite(req: Request, res: Response): Promise<Response<null>> {
		try {
			const id = req.params.id;

			const note = await NotesModel.findById(id).populate("owner", "id");

			if (!note) {
				throw new HttpException(404, "Note not found");
			}

			const token = getAuthorizationToken(req);

			const authenticatedUser = await UsersModel.findByToken(token);

			if (
				(note as any).owner._id.toHexString() !==
				authenticatedUser._id.toHexString()
			) {
				throw new ForbiddenException();
			}

			await note.updateOne({ favorite: !note.favorite });

			return res.status(204).json(null);
		} catch (err: any) {
			return handleError(err, res);
		}
	}
}

const NotesRepository = new NotesRepositoryClass();

export { NotesRepository };
