import { model, Model } from "mongoose";
import { IUserDocument, UsersSchema } from "./users.schema";

interface User {
	id: string;
	name: string;
	email: string;
	username: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IUserModel extends Model<IUserDocument> {}

const UsersModel: IUserModel = model<IUserDocument, IUserModel>(
	"Users",
	UsersSchema
);

export { User, UsersModel };
