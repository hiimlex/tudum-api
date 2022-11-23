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
const core_1 = require("../../../core");
const ErrorException_1 = require("../../../core/ErrorException");
const users_model_1 = require("./users.model");
class UsersRepository {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_model_1.UsersModel.find({});
                return res.status(200).json(users);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield users_model_1.UsersModel.findById(id);
                if (!user) {
                    throw new ErrorException_1.HttpException(404, "User not found");
                }
                return res.status(200).json(user);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const newUser = yield users_model_1.UsersModel.create(data);
                yield newUser.save();
                return res.status(201).json(newUser);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const user = yield users_model_1.UsersModel.findByToken(token);
                const data = req.body;
                if (!user) {
                    throw new ErrorException_1.HttpException(404, "User not found");
                }
                yield user.updateOne(data);
                yield user.save();
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, core_1.getAuthorizationToken)(req);
                const user = yield users_model_1.UsersModel.findByToken(token);
                if (!user) {
                    throw new ErrorException_1.HttpException(404, "User not found");
                }
                yield user.deleteOne();
                return res.status(204).json(null);
            }
            catch (err) {
                return (0, core_1.handleError)(err, res);
            }
        });
    }
}
exports.default = new UsersRepository();
