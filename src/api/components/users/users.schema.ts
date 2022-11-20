import { Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import { User } from "./users.model";

const uniqueValidator = require("mongoose-unique-validator");

export interface IUserDocument extends User, Document {
	id: string;
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
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: [isEmail, "Invalid email"],
		},
		accessToken: {
			type: String,
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

export { UsersSchema };
