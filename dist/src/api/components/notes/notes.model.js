"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesModel = void 0;
const mongoose_1 = require("mongoose");
const notes_schema_1 = require("./notes.schema");
const NotesModel = (0, mongoose_1.model)("Notes", notes_schema_1.NotesSchema);
exports.NotesModel = NotesModel;
