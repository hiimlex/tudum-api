import { model, Model, Schema } from "mongoose";
import { ITodoDocument, TodoSchema } from "./todo.schema";

interface Todo {
	title: string;
	done: boolean;
	owner: Schema.Types.ObjectId;
}

interface ITodoModel extends Model<ITodoDocument> {}

const TodoModel: ITodoModel = model<ITodoDocument, ITodoModel>(
	"Todo",
	TodoSchema
);

export { Todo, TodoModel };
