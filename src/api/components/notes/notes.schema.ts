import { Document, Schema } from "mongoose";
import { Note } from "./notes.model";

interface INotesDocument extends Note, Document {
	id: string;
}

const NotesSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "Users",
		},
	},
	{
		versionKey: false,
		timestamps: true,
		collection: "Notes",
	}
);

export { INotesDocument, NotesSchema };
