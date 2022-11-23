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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSchema = exports.TOKEN_SECRET = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const ErrorException_1 = require("../../../core/ErrorException");
const auth_1 = require("../auth");
const uniqueValidator = require("mongoose-unique-validator");
exports.TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";
const UsersSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    accessToken: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [isEmail_1.default, "Invalid email"],
    },
    theme: {
        primary: {
            type: String,
        },
        secondary: {
            type: String,
        },
    },
}, {
    versionKey: false,
    collection: "Users",
    timestamps: true,
});
exports.UsersSchema = UsersSchema;
UsersSchema.plugin(uniqueValidator, { message: "{PATH} already exists." });
UsersSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = (0, bcryptjs_1.hashSync)(user.password, 12);
        }
        next();
    });
});
UsersSchema.methods.toJSON = function () {
    const _a = this.toObject(), { password, accessToken } = _a, user = __rest(_a, ["password", "accessToken"]);
    return user;
};
UsersSchema.methods.fullUser = function () {
    const user = __rest(this.toObject(), []);
    return user;
};
UsersSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, exports.TOKEN_SECRET, { expiresIn: "8h" });
        user.accessToken = token;
        yield user.save();
        return token;
    });
};
UsersSchema.statics.findByCredentials = function (login, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let UsersModel = this;
        if (!login || !password) {
            throw new ErrorException_1.HttpException(400, `Please provide the${!login ? " login" : ""}${!login && !password ? " and" : ""}${!password ? " password" : ""}`);
        }
        let query = {};
        if ((0, isEmail_1.default)(login)) {
            query = { email: login };
        }
        else {
            query = { username: login };
        }
        const user = yield UsersModel.findOne(query);
        if (!user) {
            throw new ErrorException_1.HttpException(400, "User not found");
        }
        if (!(0, bcryptjs_1.compareSync)(password, user.password)) {
            throw new ErrorException_1.HttpException(400, "Wrong password");
        }
        return user;
    });
};
UsersSchema.statics.findByToken = function (token) {
    return __awaiter(this, void 0, void 0, function* () {
        const UsersModel = this;
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, exports.TOKEN_SECRET);
            const user = yield UsersModel.findOne({
                _id: decoded._id,
            });
            if (!user) {
                throw new auth_1.ForbiddenException();
            }
            return user;
        }
        catch (_a) {
            throw new auth_1.UnauthorizedException();
        }
    });
};
