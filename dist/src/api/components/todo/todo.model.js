"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
const mongoose_1 = require("mongoose");
const todo_schema_1 = require("./todo.schema");
const TodoModel = (0, mongoose_1.model)("Todo", todo_schema_1.TodoSchema);
exports.TodoModel = TodoModel;
