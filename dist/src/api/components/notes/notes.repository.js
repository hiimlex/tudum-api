"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesRepository = void 0;
const core_1 = require("../../../core");
const ErrorException_1 = require("../../../core/ErrorException");
const auth_1 = require("../auth");
const users_1 = require("../users");
const notes_model_1 = require("./notes.model");
class NotesRepositoryClass {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = req.query;
                const query = {};
                if (filter.title) {
                    query.title = { $regex: filter.title, $options: "i" };
                }
                if (filter.content) {
                    query.content = { $regex: filter.content, $options: "i" };
                }
                if (filter.favorite) {
                    query.favorite = filter.favorite === "true";
                }
                const notes = yield notes_model_1.NotesModel.find(query).populate("owner", "name");
                return res.status(200).json(notes);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const filter = req.query;
                const query = {};
                const pagination = {};
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
                    pagination.limit = parseInt(filter.limit);
                }
                if (filter.offset) {
                    pagination.skip = parseInt(filter.offset);
                }
                const count = yield notes_model_1.NotesModel.find(Object.assign({ owner: authenticatedUser.id }, query)).countDocuments();
                const notes = yield notes_model_1.NotesModel.find(Object.assign({ owner: authenticatedUser._id }, query))
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
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const data = req.body;
                data.owner = authenticatedUser._id;
                const note = yield notes_model_1.NotesModel.create(data);
                yield note.save();
                return res.status(201).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const note = yield notes_model_1.NotesModel.findById(id).populate("owner", "id");
                if (!note) {
                    throw new ErrorException_1.HttpException(404, "Note not found");
                }
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (note.owner._id.toHexString() !==
                    authenticatedUser._id.toHexString()) {
                    throw new auth_1.ForbiddenException();
                }
                yield note.deleteOne();
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const note = yield notes_model_1.NotesModel.findById(id).populate("owner", "id");
                if (!note) {
                    throw new ErrorException_1.HttpException(404, "Note not found");
                }
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (note.owner._id.toHexString() !==
                    authenticatedUser._id.toHexString()) {
                    throw new auth_1.ForbiddenException();
                }
                const data = req.body;
                yield note.updateOne(data);
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    favorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const note = yield notes_model_1.NotesModel.findById(id).populate("owner", "id");
                if (!note) {
                    throw new ErrorException_1.HttpException(404, "Note not found");
                }
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (note.owner._id.toHexString() !==
                    authenticatedUser._id.toHexString()) {
                    throw new auth_1.ForbiddenException();
                }
                yield note.updateOne({ favorite: !note.favorite });
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
}
const NotesRepository = new NotesRepositoryClass();
exports.NotesRepository = NotesRepository;
