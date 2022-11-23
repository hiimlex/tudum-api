import { model, Model, ObjectId } from "mongoose";
import { INotesDocument, NotesSchema } from "./notes.schema";

interface Note {
	id: string;
	title: string;
	content: string;
	favorite: boolean;
	color: string;
	owner: ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

interface NotesFilter {
	title?: any;
	content?: any;
	favorite?: boolean;
}

interface INotesModel extends Model<INotesDocument> {}

const NotesModel: INotesModel = model<INotesDocument, INotesModel>(
	"Notes",
	NotesSchema
);

export { Note, NotesModel, NotesFilter };
