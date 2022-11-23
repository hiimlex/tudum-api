import { compareSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { Document, ObjectId, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import { HttpException } from "../../../core/ErrorException";
import { ForbiddenException, UnauthorizedException } from "../auth";
import { User } from "./users.model";

const uniqueValidator = require("mongoose-unique-validator");

export interface IUserDocument extends User, Document {
	accessToken: string;
	fullUser(): Promise<User>;
	generateAuthToken(): Promise<string>;
}

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

const UsersSchema = new Schema(
	{
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
			validate: [isEmail, "Invalid email"],
		},
		theme: {
			primary: {
				type: String,
			},
			secondary: {
				type: String,
			},
		},
	},
	{
		versionKey: false,
		collection: "Users",
		timestamps: true,
	}
);

UsersSchema.plugin(uniqueValidator, { message: "{PATH} already exists." });

UsersSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = hashSync(user.password, 12);
	}

	next();
});

UsersSchema.methods.toJSON = function () {
	const { password, accessToken, ...user } = this.toObject();

	return user;
};

UsersSchema.methods.fullUser = function () {
	const { ...user } = (this as IUserDocument).toObject();

	return user;
};

UsersSchema.methods.generateAuthToken = async function () {
	const user = this as IUserDocument;
	const token = jwt.sign({ _id: user._id }, TOKEN_SECRET, { expiresIn: "8h" });

	user.accessToken = token;

	await user.save();

	return token;
};

UsersSchema.statics.findByCredentials = async function (
	login: string,
	password: string
) {
	let UsersModel = this;

	if (!login || !password) {
		throw new HttpException(
			400,
			`Please provide the${!login ? " login" : ""}${
				!login && !password ? " and" : ""
			}${!password ? " password" : ""}`
		);
	}

	let query = {};

	if (isEmail(login)) {
		query = { email: login };
	} else {
		query = { username: login };
	}

	const user = await UsersModel.findOne(query);

	if (!user) {
		throw new HttpException(400, "User not found");
	}

	if (!compareSync(password, user.password)) {
		throw new HttpException(400, "Wrong password");
	}

	return user;
};

UsersSchema.statics.findByToken = async function (token: string) {
	const UsersModel = this;
	let decoded: any;

	try {
		decoded = jwt.verify(token, TOKEN_SECRET);

		const user = await UsersModel.findOne({
			_id: decoded._id,
		});

		if (!user) {
			throw new ForbiddenException();
		}

		return user;
	} catch {
		throw new UnauthorizedException();
	}
};

export { UsersSchema };
