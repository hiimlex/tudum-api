import { model, Model } from "mongoose";
import { IUserDocument, UsersSchema } from "./users.schema";

interface User {
	name: string;
	email: string;
	username: string;
	password: string;
	theme?: {
		primary: string;
		secondary: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

interface IUserModel extends Model<IUserDocument> {
	findByCredentials(login: string, password: string): Promise<IUserDocument>;
	findByToken(token: string): Promise<IUserDocument>;
}

const UsersModel: IUserModel = model<IUserDocument, IUserModel>(
	"Users",
	UsersSchema
);

export { User, UsersModel };

