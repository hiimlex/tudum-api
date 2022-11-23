import { Schema } from "mongoose";
import { Todo } from "./todo.model";

interface ITodoDocument extends Todo, Document {}

const TodoSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		done: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		versionKey: false,
		collection: "Todo",
	}
);

export { TodoSchema, ITodoDocument };
