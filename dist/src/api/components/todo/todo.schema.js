"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoSchema = void 0;
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: "Todo",
});
exports.TodoSchema = TodoSchema;
