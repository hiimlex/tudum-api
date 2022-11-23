import { model, Model, Schema } from "mongoose";
import { ChecklistsSchema, IChecklistDocument } from "./checklist.schema";

interface Checklist {
	owner: Schema.Types.ObjectId;
	todos: Schema.Types.ObjectId[];
}

interface IChecklistsModel extends Model<IChecklistDocument> {}

const ChecklistsModel: IChecklistsModel = model<
	IChecklistDocument,
	IChecklistsModel
>("Checklists", ChecklistsSchema);

export { Checklist, ChecklistsModel };
