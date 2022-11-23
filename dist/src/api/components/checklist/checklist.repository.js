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
exports.ChecklistsRepository = void 0;
const core_1 = require("../../../core");
const ErrorException_1 = require("../../../core/ErrorException");
const auth_1 = require("../auth");
const todo_1 = require("../todo");
const users_1 = require("../users");
const checklist_model_1 = require("./checklist.model");
class ChecklistsRepositoryClass {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checklists = yield checklist_model_1.ChecklistsModel.find({})
                    .populate("todos")
                    .populate("owner", "name _id");
                return res.status(200).json(checklists);
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
                const checklist = yield checklist_model_1.ChecklistsModel.findOne({
                    owner: authenticatedUser._id,
                })
                    .populate("todos")
                    .populate("owner", "name _id");
                return res.status(200).json(checklist);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    createTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const data = req.body;
                const todo = yield todo_1.TodoModel.create(Object.assign({ owner: authenticatedUser._id }, data));
                yield todo.save();
                let checklist = yield checklist_model_1.ChecklistsModel.findOne({
                    owner: authenticatedUser._id,
                })
                    .populate("owner")
                    .populate("todos");
                if (checklist) {
                    if (checklist.owner._id.toHexString() !==
                        authenticatedUser._id.toHexString()) {
                        throw new auth_1.ForbiddenException();
                    }
                    yield checklist.update({ $push: { todos: todo._id } });
                    yield checklist.save();
                    return res.status(204).json(null);
                }
                else {
                    const newChecklist = yield checklist_model_1.ChecklistsModel.create({
                        owner: authenticatedUser._id,
                        todos: [todo._id],
                    });
                    yield newChecklist.save();
                    return res.status(201).json(null);
                }
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    deleteTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const checklist = yield checklist_model_1.ChecklistsModel.findOne({
                    owner: authenticatedUser._id,
                })
                    .populate("todos")
                    .populate("owner", "name _id");
                if (!checklist) {
                    throw new ErrorException_1.HttpException(404, "Checklist not found");
                }
                if (checklist.owner._id.toHexString() !==
                    authenticatedUser._id.toHexString()) {
                    throw new auth_1.ForbiddenException();
                }
                const id = req.params.id;
                yield checklist.updateOne({ $pull: { todos: id } });
                const todo = yield todo_1.TodoModel.findById(id);
                if (!todo) {
                    throw new ErrorException_1.HttpException(404, "Todo not found");
                }
                yield todo.deleteOne();
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    updateTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const authenticatedUser = yield users_1.UsersModel.findByToken(token);
                if (!authenticatedUser) {
                    throw new auth_1.UnauthorizedException();
                }
                const checklist = yield checklist_model_1.ChecklistsModel.findOne({
                    owner: authenticatedUser._id,
                })
                    .populate("todos")
                    .populate("owner", "name _id");
                if (!checklist) {
                    throw new ErrorException_1.HttpException(404, "Checklist not found");
                }
                if (checklist.owner._id.toHexString() !==
                    authenticatedUser._id.toHexString()) {
                    throw new auth_1.ForbiddenException();
                }
                const id = req.params.id;
                const todo = yield todo_1.TodoModel.findById(id);
                if (!todo) {
                    throw new ErrorException_1.HttpException(404, "Todo not found");
                }
                const body = req.body;
                yield todo.updateOne(body);
                yield todo.save();
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
}
const ChecklistsRepository = new ChecklistsRepositoryClass();
exports.ChecklistsRepository = ChecklistsRepository;
