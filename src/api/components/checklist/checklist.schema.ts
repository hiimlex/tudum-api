import { Schema } from "mongoose";
import { Checklist } from "./checklist.model";

interface IChecklistDocument extends Checklist, Document {}

const ChecklistsSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: "Users",
		},
		todos: [
			{
				type: Schema.Types.ObjectId,
				ref: "Todo",
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
		collection: "Checklists",
	}
);

export { ChecklistsSchema, IChecklistDocument };
