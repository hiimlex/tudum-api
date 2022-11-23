"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistsSchema = void 0;
const mongoose_1 = require("mongoose");
const ChecklistsSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
    },
    todos: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Todo",
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
    collection: "Checklists",
});
exports.ChecklistsSchema = ChecklistsSchema;
