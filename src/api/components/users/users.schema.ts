import { compareSync, hashSync } from "bcryptjs";
import { Document, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import { HttpException } from "../../../core/ErrorException";
import { User } from "./users.model";
import jwt, { decode } from "jsonwebtoken";
import { ForbiddenException, UnauthorizedException } from "../auth";

const uniqueValidator = require("mongoose-unique-validator");

export interface IUserDocument extends User, Document {
	id: string;
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
	},
	{
		versionKey: false,
		collection: "Users",
		timestamps: true,
	}
);

UsersSchema.plugin(uniqueValidator, { message: "{PATH} already exists." });

UsersSchema.pre("save", async function (next) {
	const user = this as IUserDocument;

	if (user.isModified("password")) {
		user.password = hashSync(user.password, 12);
	}

	next();
});

UsersSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

UsersSchema.set("toJSON", {
	virtuals: true,
});

UsersSchema.set("toObject", {
	virtuals: true,
});

UsersSchema.methods.toJSON = function () {
	const { _id, password, accessToken, ...user } = this.toObject();

	return user;
};

UsersSchema.methods.fullUser = function () {
	const { _id, ...user } = (this as IUserDocument).toObject();

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
