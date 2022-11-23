"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesSchema = void 0;
const mongoose_1 = require("mongoose");
const NotesSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
    },
}, {
    versionKey: false,
    timestamps: true,
    collection: "Notes",
});
exports.NotesSchema = NotesSchema;
